import empty from 'is-empty';
import HandlerGraph from '../_helpers/HandlerGraphql';
import { getDynamicConfig } from '../_helpers/dynamicConfig';

class AuthService {
  static async login({ token, macAddress, geoLocation, ipAddress, publicIpAddress } = {}) {
    const { hostname } = getDynamicConfig();

    // Try v2 first (with publicIpAddress), fallback to original if v2 not deployed
    try {
      return await AuthService._loginV2({ token, hostname, macAddress, geoLocation, ipAddress, publicIpAddress });
    } catch (e) {
      console.warn('[AuthService] v2 login failed, trying original:', e.message);
      return await AuthService._loginOriginal({ token, hostname, macAddress, geoLocation, ipAddress });
    }
  }

  static async _loginV2({ token, hostname, macAddress, geoLocation, ipAddress, publicIpAddress }) {
    const query = `mutation {
            procAuthenticateJwtTokenTokenMacGeoV2(input: 
              {
                pToken: ${token}
                pSubdomain: "${hostname}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
                pPublicIpAddress: "${publicIpAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenTokenMacGeoV2.jwtTokenToken;
  }

  static async _loginOriginal({ token, hostname, macAddress, geoLocation, ipAddress }) {
    const query = `mutation {
            procAuthenticateJwtTokenTokenMacGeo(input: 
              {
                pToken: ${token}
                pSubdomain: "${hostname}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenTokenMacGeo.jwtTokenToken;
  }

  static async loginUserPass({ username, password, macAddress, geoLocation, ipAddress, publicIpAddress }) {
    const { hostname } = getDynamicConfig();

    try {
      return await AuthService._loginUserPassV2({ username, password, hostname, macAddress, geoLocation, ipAddress, publicIpAddress });
    } catch (e) {
      console.warn('[AuthService] v2 loginUserPass failed, trying original:', e.message);
      return await AuthService._loginUserPassOriginal({ username, password, hostname, macAddress, geoLocation, ipAddress });
    }
  }

  static async _loginUserPassV2({ username, password, hostname, macAddress, geoLocation, ipAddress, publicIpAddress }) {
    const query = `mutation {
            procAuthenticateJwtTokenUserPassMacGeoV2(input: 
              {
                pEmail: "${username}"
                pPassword: "${password}"
                pSubdomain: "${hostname}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
                pPublicIpAddress: "${publicIpAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenUserPassMacGeoV2.jwtTokenToken;
  }

  static async _loginUserPassOriginal({ username, password, hostname, macAddress, geoLocation, ipAddress }) {
    const query = `mutation {
            procAuthenticateJwtTokenUserPassMacGeo(input: 
              {
                pEmail: "${username}"
                pPassword: "${password}"
                pSubdomain: "${hostname}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenUserPassMacGeo.jwtTokenToken;
  }

  static async loginTicketOffice({ token, ticketOfficeId, macAddress, geoLocation, ipAddress, publicIpAddress }) {
    try {
      return await AuthService._loginTicketOfficeV2({ token, ticketOfficeId, macAddress, geoLocation, ipAddress, publicIpAddress });
    } catch (e) {
      console.warn('[AuthService] v2 loginTicketOffice failed, trying original:', e.message);
      return await AuthService._loginTicketOfficeOriginal({ token, ticketOfficeId, macAddress, geoLocation, ipAddress });
    }
  }

  static async _loginTicketOfficeV2({ token, ticketOfficeId, macAddress, geoLocation, ipAddress, publicIpAddress }) {
    const query = `mutation {
              procAuthenticateJwtTokenTicketOfficeV2(input: 
              {
                pToken: ${token}
                pTicketOffice: "${ticketOfficeId}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
                pPublicIpAddress: "${publicIpAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenTicketOfficeV2.jwtTokenToken;
  }

  static async _loginTicketOfficeOriginal({ token, ticketOfficeId, macAddress, geoLocation, ipAddress }) {
    const query = `mutation {
              procAuthenticateJwtTokenTicketOffice(input: 
              {
                pToken: ${token}
                pTicketOffice: "${ticketOfficeId}"
                pMacAddress: "${macAddress || ''}"
                pGeoLocation: "${geoLocation || ''}"
                pIpAddress: "${ipAddress || ''}"
              }) {
              jwtTokenToken
            }
          }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.procAuthenticateJwtTokenTicketOffice.jwtTokenToken;
  }

  static async getDateBD() {
    const query = `query{
      allVMultipleDates(first:1){
        nodes{
          today
          nextWeek
        }
      }
    }`;

    const response = await HandlerGraph.sendRequest({ query });
    if (!empty(response.data.errors)) throw new Error(response.data.errors[0].message);
    return response.data.data.allVMultipleDates.nodes[0];
  }
}

export default AuthService;
