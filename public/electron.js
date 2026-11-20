const { app, BrowserWindow, BrowserView, ipcMain, safeStorage, dialog, Menu, session } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// Use app.isPackaged instead of electron-is-dev for reliable detection
const isDev = !app.isPackaged;

function isGbcProduct() {
    if (process.env.TAQUILLA_PRODUCT === 'gbc') return true;
    try {
        const name = app.getName();
        return name === 'GBC Gaming' || name === 'gbc-gaming';
    } catch (e) {
        return false;
    }
}

function productInfo() {
    const gbc = isGbcProduct();
    return {
        gbc,
        title: gbc ? 'GBC Gaming' : 'Taquilla Física',
    };
}

let mainWindow;
let activeViews = {}; // { hostname: BrowserView }
let activeHostname = null;

// ── Agencies Config (persisted to disk) ────────────────────────────
const agenciesPath = path.join(app.getPath('userData'), 'agencies.json');

function loadAgencies() {
    try {
        if (fs.existsSync(agenciesPath)) {
            return JSON.parse(fs.readFileSync(agenciesPath, 'utf-8'));
        }
    } catch (e) {
        console.error('[Agencies] Error loading:', e.message);
    }
    return [];
}

function saveAgencies(agencies) {
    try {
        fs.writeFileSync(agenciesPath, JSON.stringify(agencies, null, 2), 'utf-8');
    } catch (e) {
        console.error('[Agencies] Error saving:', e.message);
    }
}

// ── Auto-Updater Configuration ──────────────────────────────────────
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.logger = require('electron').app ? console : null;

function sendToRenderer(channel, data) {
    if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send(channel, data);
    }
    // Also send to all active views
    Object.values(activeViews).forEach(view => {
        if (view && view.webContents) {
            try { view.webContents.send(channel, data); } catch (e) { /* view might be destroyed */ }
        }
    });
}

// ── Tab Bar Height ──────────────────────────────────────────────────
const TAB_BAR_HEIGHT = 40;

function getContentBounds() {
    if (!mainWindow) return { x: 0, y: 0, width: 1366, height: 728 };
    const bounds = mainWindow.getContentBounds();
    return {
        x: 0,
        y: TAB_BAR_HEIGHT,
        width: bounds.width,
        height: bounds.height - TAB_BAR_HEIGHT
    };
}

// ── BrowserView Management ──────────────────────────────────────────

function createViewForHostname(hostname) {
    const startUrl = isDev
        ? 'http://localhost:8080'
        : `file://${path.join(__dirname, '../dist/index.html')}`;

    const partitionName = `persist:${hostname}`;

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            // Each hostname gets its own partition → isolated localStorage
            partition: partitionName,
        },
    });

    // ── Disable HTTP cache on this partition to avoid stale ticket data ──
    const ses = view.webContents.session;
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        details.requestHeaders['Pragma'] = 'no-cache';
        callback({ requestHeaders: details.requestHeaders });
    });

    view.setBounds(getContentBounds());
    view.setAutoResize({ width: true, height: true });

    // Load the app and set the SELECTED_HOST in the partition's localStorage
    view.webContents.loadURL(startUrl).then(() => {
        view.webContents.executeJavaScript(`
            if (!localStorage.getItem('SELECTED_HOST')) {
                localStorage.setItem('SELECTED_HOST', '${hostname}');
                window.location.reload();
            }
        `);
    });

    // ── Silent Printing: intercept window.print() ──
    view.webContents.on('print', (event) => {
        // Prevent the default print dialog
        event.preventDefault();
    });

    // Override window.print() in the renderer to use silent printing
    view.webContents.on('did-finish-load', () => {
        view.webContents.executeJavaScript(`
            const _originalPrint = window.print;
            window.print = function() {
                // Notify main process to do silent print
                const { ipcRenderer } = require('electron');
                ipcRenderer.send('silent-print', '${hostname}');
            };
        `);
    });

    // Also override after each navigation (SPA hash changes)
    view.webContents.on('did-navigate-in-page', () => {
        view.webContents.executeJavaScript(`
            if (!window._silentPrintOverridden) {
                window._silentPrintOverridden = true;
                window.print = function() {
                    const { ipcRenderer } = require('electron');
                    ipcRenderer.send('silent-print', '${hostname}');
                };
            }
        `);
    });

    if (isDev) {
        view.webContents.openDevTools({ mode: 'detach' });
    }

    activeViews[hostname] = view;
    return view;
}

function switchToView(hostname) {
    if (!mainWindow) return;

    // Hide all views
    Object.entries(activeViews).forEach(([host, view]) => {
        if (host !== hostname) {
            mainWindow.removeBrowserView(view);
        }
    });

    // Show the selected view
    let view = activeViews[hostname];
    if (!view) {
        view = createViewForHostname(hostname);
    }

    mainWindow.addBrowserView(view);
    view.setBounds(getContentBounds());
    activeHostname = hostname;

    // Notify the tab bar about the active tab
    mainWindow.webContents.send('active-agency-changed', hostname);
}

function removeView(hostname) {
    const view = activeViews[hostname];
    if (view) {
        mainWindow.removeBrowserView(view);
        view.webContents.destroy();
        delete activeViews[hostname];
    }

    // Remove from saved agencies
    let agencies = loadAgencies();
    agencies = agencies.filter(a => a !== hostname);
    saveAgencies(agencies);

    // Switch to another view if this was active
    if (activeHostname === hostname) {
        activeHostname = null;
        if (agencies.length > 0) {
            switchToView(agencies[0]);
        }
    }

    // Notify tab bar
    mainWindow.webContents.send('agencies-updated', { agencies, active: activeHostname });
}

// ── Window Creation ─────────────────────────────────────────────────

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, 'icon.png'),
        title: productInfo().title,
    });

    // Load the tab bar HTML (a lightweight page that renders the tab bar)
    const tabBarUrl = isDev
        ? `file://${path.join(__dirname, 'tabbar.html')}`
        : `file://${path.join(__dirname, 'tabbar.html')}`;

    mainWindow.loadURL(tabBarUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
        activeViews = {};
        activeHostname = null;
    });

    mainWindow.on('resize', () => {
        // Update all view bounds on resize
        Object.values(activeViews).forEach(view => {
            view.setBounds(getContentBounds());
        });
    });

    // After the tab bar loads, initialize views for saved agencies
    mainWindow.webContents.once('did-finish-load', () => {
        const agencies = loadAgencies();
        mainWindow.webContents.send('product-info', productInfo());
        mainWindow.webContents.send('agencies-updated', { agencies, active: activeHostname });

        if (agencies.length > 0) {
            // Create views for all agencies, show the first one
            agencies.forEach(hostname => createViewForHostname(hostname));
            switchToView(agencies[0]);
        }

        // Check for updates (production only)
        if (!isDev) {
            setTimeout(() => {
                /* sin servidor de actualizaciones */
            }, 3000);
        }
    });
}

// ── Custom Application Menu ──────────────────────────────────────────
function buildAppMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Agregar Agencia...',
                    click: () => {
                        mainWindow.webContents.send('show-add-agency');
                    }
                },
                {
                    label: 'Cambiar Configuración de Agencia...',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'question',
                            title: 'Cambiar Configuración',
                            message: '¿Desea cambiar la configuración de agencia? Esto le llevará a la pantalla de configuración inicial.',
                            buttons: ['Sí', 'Cancelar'],
                            defaultId: 0,
                            cancelId: 1,
                        }).then((result) => {
                            if (result.response === 0) {
                                // Clear all agencies and reload
                                Object.keys(activeViews).forEach(h => removeView(h));
                                saveAgencies([]);
                                mainWindow.webContents.send('agencies-updated', { agencies: [], active: null });
                            }
                        });
                    }
                },
                { type: 'separator' },
                { role: 'quit', label: 'Salir' }
            ]
        },
        {
            label: 'Editar',
            submenu: [
                { role: 'undo', label: 'Deshacer' },
                { role: 'redo', label: 'Rehacer' },
                { type: 'separator' },
                { role: 'cut', label: 'Cortar' },
                { role: 'copy', label: 'Copiar' },
                { role: 'paste', label: 'Pegar' },
                { role: 'selectAll', label: 'Seleccionar todo' }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                {
                    label: 'Recargar',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (activeHostname && activeViews[activeHostname]) {
                            activeViews[activeHostname].webContents.reload();
                        }
                    }
                },
                {
                    label: 'Forzar recarga',
                    accelerator: 'CmdOrCtrl+Shift+R',
                    click: () => {
                        if (activeHostname && activeViews[activeHostname]) {
                            activeViews[activeHostname].webContents.reloadIgnoringCache();
                        }
                    }
                },
                {
                    label: 'Herramientas de desarrollo',
                    accelerator: 'F12',
                    click: () => {
                        if (activeHostname && activeViews[activeHostname]) {
                            activeViews[activeHostname].webContents.toggleDevTools();
                        }
                    }
                },
                {
                    label: 'DevTools Tab Bar',
                    click: () => {
                        if (mainWindow) mainWindow.webContents.toggleDevTools();
                    }
                },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom normal' },
                { role: 'zoomIn', label: 'Acercar' },
                { role: 'zoomOut', label: 'Alejar' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Pantalla completa' }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { role: 'minimize', label: 'Minimizar' },
                { role: 'close', label: 'Cerrar' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: `Versión: ${app.getVersion()}`,
                    enabled: false
                },
                { type: 'separator' },
                {
                    label: 'Buscar Actualización...',
                    click: () => {
                        console.log('[Menu] Manual update check requested');
                        /* sin servidor de actualizaciones */
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

app.on('ready', () => {
    buildAppMenu();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// ── IPC Handlers for Agency Management ──────────────────────────────

ipcMain.on('add-agency', (event, hostname) => {
    let agencies = loadAgencies();
    if (!agencies.includes(hostname)) {
        agencies.push(hostname);
        saveAgencies(agencies);
        createViewForHostname(hostname);
    }
    switchToView(hostname);
    mainWindow.webContents.send('agencies-updated', { agencies, active: hostname });
});

ipcMain.on('remove-agency', (event, hostname) => {
    removeView(hostname);
});

ipcMain.on('switch-agency', (event, hostname) => {
    switchToView(hostname);
});

ipcMain.on('get-product', (event) => {
    event.sender.send('product-info', productInfo());
});

ipcMain.on('get-agencies', (event) => {
    const agencies = loadAgencies();
    event.reply('agencies-updated', { agencies, active: activeHostname });
});

// Temporarily hide BrowserView so modal in tabbar.html is visible
ipcMain.on('show-modal', () => {
    if (mainWindow && activeHostname && activeViews[activeHostname]) {
        mainWindow.removeBrowserView(activeViews[activeHostname]);
    }
});

// Restore BrowserView after modal is closed
ipcMain.on('hide-modal', () => {
    if (mainWindow && activeHostname && activeViews[activeHostname]) {
        mainWindow.addBrowserView(activeViews[activeHostname]);
        activeViews[activeHostname].setBounds(getContentBounds());
    }
});

// ── Printer Configuration ───────────────────────────────────────────
const printerConfigPath = path.join(app.getPath('userData'), 'printerConfig.json');

function loadPrinterConfig() {
    try {
        if (fs.existsSync(printerConfigPath)) {
            return JSON.parse(fs.readFileSync(printerConfigPath, 'utf-8'));
        }
    } catch (e) {
        console.error('[Printer] Error loading config:', e.message);
    }
    return {}; // { hostname: printerName }
}

function savePrinterConfig(config) {
    try {
        fs.writeFileSync(printerConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    } catch (e) {
        console.error('[Printer] Error saving config:', e.message);
    }
}

// Get list of available printers
ipcMain.handle('get-printers', async () => {
    if (!mainWindow) return [];
    const printers = mainWindow.webContents.getPrinters();
    return printers.map(p => ({
        name: p.name,
        isDefault: p.isDefault,
        status: p.status,
    }));
});

// Save printer config for a hostname
ipcMain.on('set-printer', (event, { hostname, printerName }) => {
    const config = loadPrinterConfig();
    config[hostname] = printerName;
    savePrinterConfig(config);
    console.log(`[Printer] Set printer for ${hostname}: ${printerName}`);
});

// Get printer config for a hostname
ipcMain.handle('get-printer', async (event, hostname) => {
    const config = loadPrinterConfig();
    return config[hostname] || null;
});

// Silent print handler - called from BrowserView when window.print() is invoked
ipcMain.on('silent-print', (event, hostname) => {
    const view = activeViews[hostname];
    if (!view) {
        console.error('[Printer] No view found for hostname:', hostname);
        return;
    }

    const config = loadPrinterConfig();
    const printerName = config[hostname];

    const printOptions = {
        silent: true,
        printBackground: true,
        margins: { marginType: 'none' },
    };

    // Use configured printer or system default
    if (printerName) {
        printOptions.deviceName = printerName;
    }

    console.log(`[Printer] Printing for ${hostname} on ${printerName || 'default printer'}...`);

    view.webContents.print(printOptions, (success, failureReason) => {
        if (!success) {
            console.error('[Printer] Print failed:', failureReason);
            // Notify the BrowserView about the print failure
            try {
                view.webContents.executeJavaScript(`
                    console.error('[Impresión] Error: ${failureReason || 'desconocido'}');
                `);
            } catch (e) { /* view might be destroyed */ }
        } else {
            console.log('[Printer] Print successful');
        }
    });
});

// ── Auto-Updater Events ─────────────────────────────────────────────

autoUpdater.on('checking-for-update', () => {
    console.log('[AutoUpdater] Checking for updates...');
    sendToRenderer('update_status', { status: 'checking' });
});

autoUpdater.on('update-available', (info) => {
    console.log('[AutoUpdater] Update available:', info.version);
    sendToRenderer('update_status', {
        status: 'available',
        version: info.version,
        releaseDate: info.releaseDate,
    });
});

autoUpdater.on('update-not-available', (info) => {
    console.log('[AutoUpdater] App is up to date:', info.version);
    sendToRenderer('update_status', { status: 'up-to-date', version: info.version });
});

autoUpdater.on('download-progress', (progress) => {
    console.log(`[AutoUpdater] Download progress: ${Math.round(progress.percent)}%`);
    sendToRenderer('update_status', {
        status: 'downloading',
        percent: Math.round(progress.percent),
        transferred: progress.transferred,
        total: progress.total,
        bytesPerSecond: progress.bytesPerSecond,
    });
});

autoUpdater.on('update-downloaded', (info) => {
    console.log('[AutoUpdater] Update downloaded:', info.version);
    sendToRenderer('update_status', {
        status: 'downloaded',
        version: info.version,
    });

    // Force install after a short delay to let the user see the notification
    dialog.showMessageBox(mainWindow, {
        type: 'info',
        title: 'Actualización disponible',
        message: `La versión ${info.version} ha sido descargada. La aplicación se reiniciará para aplicar la actualización.`,
        buttons: ['Reiniciar ahora'],
        defaultId: 0,
    }).then(() => {
        autoUpdater.quitAndInstall(false, true);
    });
});

autoUpdater.on('error', (err) => {
    console.error('[AutoUpdater] Error:', err.message);
    sendToRenderer('update_status', {
        status: 'error',
        message: err.message,
    });
});

// Renderer can request to install the update now
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall(false, true);
});

// Renderer can request a manual update check
ipcMain.on('check_for_updates', () => {
    /* sin servidor de actualizaciones */
});

// Expose the app version to the renderer
ipcMain.on('get_app_version', (event) => {
    event.reply('app_version', app.getVersion());
});

// ── MAC Address ─────────────────────────────────────────────────────

ipcMain.on('get-mac-address', (event) => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let mac = '';

    // Priority 1: non-internal IPv4
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
                mac = net.mac;
                break;
            }
        }
        if (mac) break;
    }

    // Priority 2: any non-internal
    if (!mac) {
        for (const name of Object.keys(networkInterfaces)) {
            for (const net of networkInterfaces[name]) {
                if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
                    mac = net.mac;
                    break;
                }
            }
            if (mac) break;
        }
    }

    // Priority 3: any MAC that is valid
    if (!mac) {
        for (const name of Object.keys(networkInterfaces)) {
            for (const net of networkInterfaces[name]) {
                if (net.mac && net.mac !== '00:00:00:00:00:00') {
                    mac = net.mac;
                    break;
                }
            }
            if (mac) break;
        }
    }

    event.reply('get-mac-address-reply', mac || '00:00:00:00:00:00');
});

// ── Secure Credentials Storage (per-hostname) ──────────────────────

function getCredentialsPath(hostname) {
    // Each agency gets its own encrypted credentials file
    const safeName = (hostname || 'default').replace(/[^a-zA-Z0-9.-]/g, '_');
    return path.join(app.getPath('userData'), `credentials_${safeName}.enc`);
}

// Legacy single-file path (for migration)
const legacyCredentialsPath = path.join(app.getPath('userData'), 'credentials.enc');

ipcMain.handle('secure-set-credentials', async (event, { username, password, hostname }) => {
    try {
        // Determine which hostname this BrowserView belongs to
        const host = hostname || getHostnameFromEvent(event);
        const credPath = getCredentialsPath(host);

        if (safeStorage.isEncryptionAvailable()) {
            const data = JSON.stringify({ username, password });
            const encrypted = safeStorage.encryptString(data);
            await fs.promises.writeFile(credPath, encrypted);
            return { success: true };
        } else {
            console.error("Encryption not available");
            return { success: false, error: "Encryption not available" };
        }
    } catch (e) {
        console.error("Error saving credentials", e);
        return { success: false, error: e.message };
    }
});

ipcMain.handle('secure-get-credentials', async (event, hostname) => {
    try {
        const host = hostname || getHostnameFromEvent(event);
        const credPath = getCredentialsPath(host);

        // Try per-hostname file first
        if (fs.existsSync(credPath)) {
            const encrypted = await fs.promises.readFile(credPath);
            if (safeStorage.isEncryptionAvailable()) {
                const decrypted = safeStorage.decryptString(encrypted);
                return JSON.parse(decrypted);
            }
        }

        // Fallback: migrate legacy single-file credentials to this hostname
        if (fs.existsSync(legacyCredentialsPath)) {
            const encrypted = await fs.promises.readFile(legacyCredentialsPath);
            if (safeStorage.isEncryptionAvailable()) {
                const decrypted = safeStorage.decryptString(encrypted);
                const creds = JSON.parse(decrypted);
                // Migrate: save to per-hostname file and delete legacy
                const newEncrypted = safeStorage.encryptString(JSON.stringify(creds));
                await fs.promises.writeFile(credPath, newEncrypted);
                return creds;
            }
        }

        return null;
    } catch (e) {
        console.error("Error reading credentials", e);
        return null;
    }
});

ipcMain.handle('secure-delete-credentials', async (event, hostname) => {
    try {
        const host = hostname || getHostnameFromEvent(event);
        const credPath = getCredentialsPath(host);
        if (fs.existsSync(credPath)) {
            await fs.promises.unlink(credPath);
        }
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
});

// Helper: determine hostname from the event sender (BrowserView webContents)
function getHostnameFromEvent(event) {
    const senderWC = event.sender;
    for (const [host, view] of Object.entries(activeViews)) {
        if (view.webContents === senderWC || view.webContents.id === senderWC.id) {
            return host;
        }
    }
    return activeHostname || 'default';
}
