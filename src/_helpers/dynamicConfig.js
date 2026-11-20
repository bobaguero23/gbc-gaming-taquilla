import config from 'config';

function agencyCode(value) {
    const host = String(value || '').trim().toLowerCase();
    if (!host || host === 'localhost' || host === '127.0.0.1') return '';
    return host;
}

export const getDynamicConfig = () => {
    const fromUrl = agencyCode(new URLSearchParams(window.location.search).get('agency'));
    const storedHost = agencyCode(localStorage.getItem('SELECTED_HOST'));
    const selectedHost = fromUrl || storedHost;

    if (fromUrl && localStorage.getItem('SELECTED_HOST') !== fromUrl) {
        localStorage.setItem('SELECTED_HOST', fromUrl);
    }

    if (!selectedHost) {
        return {
            ...config,
            hostname: window.location.hostname, // Fallback for dev/browser
        };
    }

    // Construct dynamic URLs based on the selected host
    // Assuming the API follows a standard pattern relative to the host
    // Or if the APIs are totally different, we might need a mapping.
    // For now, based on the user request, we assume the client configures the "web page" (hostname)
    // and we try to infer the API or use the static config but "spoof" the hostname.

    // NOTE: If the APIs are always on specific subdomains of the selected host:
    // e.g. host: agency. -> api: api. (might remain static?)
    // OR host: agency.myprivatebook.com -> api: api.myprivatebook.com

    // Looking at the static config:
    // api endpoints stay empty in this public build

    // The original code used window.location.hostname to select the LOGO and branding (APPS list in lib.js).
    // Truly dynamic API endpoints might require more logic, but for now we primarily need to 
    // satisfy the "Subdomain/Tenant Login" logic which relies on hostname.

    return {
        ...config,
        hostname: selectedHost,
    };
};
