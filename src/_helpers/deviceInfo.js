/**
 * DeviceInfo — Collects MAC address, IP addresses, and geolocation for taquilla tracking
 * 
 * In Electron, we can access Node.js APIs to get the MAC address and private IP.
 * Public IP and geolocation are fetched via external API (ipapi.co).
 */

class DeviceInfo {

  static _macAddress = null;
  static _geoLocation = null;
  static _ipAddress = null;
  static _publicIpAddress = null;
  static _publicIpData = null; // Cache full response from ipapi.co

  /**
   * Get the MAC address of the first non-internal network interface.
   * Only works in Electron (Node.js context).
   */
  static getMacAddress() {
    if (this._macAddress) return this._macAddress;

    try {
      // In Electron with nodeIntegration: true, we can use require
      const os = window.require('os');
      const interfaces = os.networkInterfaces();

      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          // Skip internal and loopback interfaces
          if (iface.internal) continue;
          // Skip if no MAC
          if (!iface.mac || iface.mac === '00:00:00:00:00:00') continue;
          // Prefer IPv4 interfaces
          if (iface.family === 'IPv4' || iface.family === 4) {
            this._macAddress = iface.mac;
            return this._macAddress;
          }
        }
      }

      // Fallback: return first non-internal MAC found
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.internal) continue;
          if (iface.mac && iface.mac !== '00:00:00:00:00:00') {
            this._macAddress = iface.mac;
            return this._macAddress;
          }
        }
      }
    } catch (e) {
      console.log('[DeviceInfo] Cannot get MAC (not in Electron?):', e.message);
    }

    return '';
  }

  /**
   * Get the local/private IP address of the first non-internal network interface.
   * Only works in Electron (Node.js context).
   */
  static getIpAddress() {
    if (this._ipAddress) return this._ipAddress;

    try {
      const os = window.require('os');
      const interfaces = os.networkInterfaces();

      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
          if (iface.internal) continue;
          if (iface.family === 'IPv4' || iface.family === 4) {
            this._ipAddress = iface.address;
            return this._ipAddress;
          }
        }
      }
    } catch (e) {
      console.log('[DeviceInfo] Cannot get IP (not in Electron?):', e.message);
    }

    return '';
  }

  /**
   * Fetch public IP + geolocation data from ipapi.co (free tier: 1000 req/day).
   * Caches the result so we only call the API once per session.
   */
  static async _fetchPublicIpData() {
    if (this._publicIpData) return this._publicIpData;

    try {
      const response = await fetch('https://ipapi.co/json/', { 
        signal: AbortSignal.timeout(8000) 
      });
      if (response.ok) {
        this._publicIpData = await response.json();
        console.log('[DeviceInfo] Public IP data:', this._publicIpData.ip, this._publicIpData.city, this._publicIpData.country_name);
        return this._publicIpData;
      }
    } catch (e) {
      console.log('[DeviceInfo] ipapi.co failed:', e.message);
    }

    // Fallback: try ip-api.com (free, no API key needed)
    try {
      const response = await fetch('http://ip-api.com/json/?fields=status,query,lat,lon,city,regionName,country', {
        signal: AbortSignal.timeout(5000)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          this._publicIpData = {
            ip: data.query,
            latitude: data.lat,
            longitude: data.lon,
            city: data.city,
            region: data.regionName,
            country_name: data.country,
          };
          console.log('[DeviceInfo] Public IP data (ip-api):', this._publicIpData.ip, this._publicIpData.city);
          return this._publicIpData;
        }
      }
    } catch (e) {
      console.log('[DeviceInfo] ip-api.com fallback failed:', e.message);
    }

    return null;
  }

  /**
   * Get the PUBLIC IP address (ISP/router IP, visible from the internet).
   * Uses ipapi.co API.
   */
  static async getPublicIpAddress() {
    if (this._publicIpAddress) return this._publicIpAddress;

    const data = await this._fetchPublicIpData();
    if (data && data.ip) {
      this._publicIpAddress = data.ip;
      return this._publicIpAddress;
    }

    return '';
  }

  /**
   * Get geolocation using multiple strategies:
   * 1. HTML5 Geolocation API (GPS/WiFi - most accurate)
   * 2. Public IP geolocation via ipapi.co (city-level accuracy)
   * 3. Manual location from localStorage (TAQUILLA_LOCATION)
   */
  static getGeoLocation() {
    return new Promise((resolve) => {
      // Return cached location if available
      if (this._geoLocation) {
        resolve(this._geoLocation);
        return;
      }

      if (!navigator.geolocation) {
        console.log('[DeviceInfo] Geolocation API not available, using IP fallback');
        this._getGeoByPublicIP().then(resolve);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this._geoLocation = `${position.coords.latitude},${position.coords.longitude}`;
          console.log('[DeviceInfo] GeoLocation (GPS/WiFi):', this._geoLocation);
          resolve(this._geoLocation);
        },
        (error) => {
          console.log('[DeviceInfo] GeoLocation HTML5 error:', error.message, '- falling back to IP');
          this._getGeoByPublicIP().then(resolve);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000, // Reduced timeout since this usually fails in Electron
          maximumAge: 3600000
        }
      );
    });
  }

  /**
   * Get geolocation from public IP via ipapi.co.
   * Falls back to manual TAQUILLA_LOCATION if API fails.
   */
  static async _getGeoByPublicIP() {
    const data = await this._fetchPublicIpData();
    if (data && data.latitude && data.longitude) {
      this._geoLocation = `${data.latitude},${data.longitude}`;
      console.log('[DeviceInfo] GeoLocation (public IP):', this._geoLocation, `(${data.city || 'unknown city'})`);
      return this._geoLocation;
    }

    // Final fallback: manual location from SetupPage
    const manualLocation = localStorage.getItem('TAQUILLA_LOCATION');
    if (manualLocation) {
      this._geoLocation = manualLocation;
      console.log('[DeviceInfo] GeoLocation (manual):', this._geoLocation);
      return this._geoLocation;
    }

    console.log('[DeviceInfo] All geolocation methods failed');
    return '';
  }

  /**
   * Get all device info at once (MAC + geo + both IPs)
   * Call this during login to get fresh data
   */
  static async getAll() {
    const macAddress = this.getMacAddress();
    const geoLocation = await this.getGeoLocation();
    const ipAddress = this.getIpAddress();
    const publicIpAddress = await this.getPublicIpAddress();
    return { macAddress, geoLocation, ipAddress, publicIpAddress };
  }
}

export default DeviceInfo;
