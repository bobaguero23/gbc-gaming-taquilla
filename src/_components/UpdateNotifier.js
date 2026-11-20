import React from 'react';
import './UpdateNotifier.css';

class UpdateNotifier extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,    // 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'up-to-date'
            version: null,
            percent: 0,
            errorMessage: null,
            dismissed: false,
        };
        this._listener = null;
    }

    componentDidMount() {
        // Only set up IPC listener if running inside Electron
        const isElectron = !!window.process && (window.process.type === 'renderer' || window.process.versions['electron']);
        if (!isElectron) return;

        try {
            const { ipcRenderer } = window.require('electron');
            this._listener = (event, data) => {
                this.setState({
                    status: data.status,
                    version: data.version || this.state.version,
                    percent: data.percent || 0,
                    errorMessage: data.message || null,
                    dismissed: false, // Show banner again on new events
                });
            };
            ipcRenderer.on('update_status', this._listener);
        } catch (err) {
            console.warn('UpdateNotifier: Could not set up IPC listener', err);
        }
    }

    componentWillUnmount() {
        if (this._listener) {
            try {
                const { ipcRenderer } = window.require('electron');
                ipcRenderer.removeListener('update_status', this._listener);
            } catch (err) {
                // ignore
            }
        }
    }

    handleRestart = () => {
        try {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('restart_app');
        } catch (err) {
            console.error('UpdateNotifier: Could not send restart_app', err);
        }
    }

    handleDismiss = () => {
        this.setState({ dismissed: true });
    }

    formatBytes(bytes) {
        if (!bytes) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        let val = bytes;
        while (val >= 1024 && i < units.length - 1) {
            val /= 1024;
            i++;
        }
        return `${val.toFixed(1)} ${units[i]}`;
    }

    render() {
        const { status, version, percent, errorMessage, dismissed } = this.state;

        // Don't show anything for these states
        if (!status || status === 'checking' || status === 'up-to-date' || dismissed) {
            return null;
        }

        let bannerClass = '';
        let icon = '';
        let title = '';
        let detail = '';
        let showProgress = false;
        let showRestartBtn = false;

        switch (status) {
            case 'available':
            case 'downloading':
                bannerClass = 'downloading';
                icon = '⬇️';
                title = `Descargando actualización${version ? ` v${version}` : ''}...`;
                detail = percent > 0 ? `${percent}%` : 'Iniciando descarga...';
                showProgress = true;
                break;

            case 'downloaded':
                bannerClass = 'downloaded';
                icon = '✅';
                title = `Actualización${version ? ` v${version}` : ''} lista`;
                detail = 'Reinicia la aplicación para aplicar la actualización.';
                showRestartBtn = true;
                break;

            case 'error':
                bannerClass = 'error';
                icon = '⚠️';
                title = 'Error al actualizar';
                detail = errorMessage || 'No se pudo descargar la actualización.';
                break;

            default:
                return null;
        }

        return (
            <div className="update-notifier-overlay">
                <div className={`update-notifier-banner ${bannerClass}`}>
                    <div className="update-notifier-info">
                        <span className="update-notifier-icon">{icon}</span>
                        <div className="update-notifier-text">
                            <span className="update-notifier-title">{title}</span>
                            <span className="update-notifier-detail">{detail}</span>
                        </div>
                    </div>

                    {showProgress && (
                        <div className="update-progress-container">
                            <div
                                className="update-progress-bar"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    )}

                    <div className="update-notifier-actions">
                        {showRestartBtn && (
                            <button className="update-btn update-btn-primary" onClick={this.handleRestart}>
                                Reiniciar ahora
                            </button>
                        )}
                        <button className="update-btn update-btn-dismiss" onClick={this.handleDismiss}>
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateNotifier;
