import empty from 'is-empty';
import axios from 'axios';
import config from 'config';
import jwtDecode from 'jwt-decode';

import { getDynamicConfig } from './dynamicConfig';
import QueryCache from './queryCache';

export default class HandlerGraph {
  static async sendRequest({ query }) {
    // Check cache first (only for non-mutation queries)
    const cached = QueryCache.get(query);
    if (cached) {
      return { data: cached };
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (empty(localStorage.getItem('token'))) {
      headers.sessionId = localStorage.getItem('recaptcha');
    }

    if (!empty(localStorage.getItem('token'))) {
      headers.authorization = `bearer ${localStorage.getItem('token')}`;
    }

    const response = await axios({
      url: `${getDynamicConfig().apiUrl}`,
      method: 'post',
      headers,
      data: {
        query,
      },
      timeout: 30000,
    });

    // Cache the response for future use
    if (response && response.data) {
      QueryCache.set(query, response.data);
    }

    return response;
  }

  static async sendRequestSports({ query }) {
    // Check cache first
    const cached = QueryCache.get(query);
    if (cached) {
      return { data: cached };
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    let secret = '';

    if ((empty(localStorage.getItem('token')))) {
      headers.sessionId = '';

      if (!empty(localStorage.getItem('recaptcha'))) {
        headers.sessionId = localStorage.getItem('recaptcha');
      }

      if (!empty(localStorage.getItem('sessionIdApp'))) {
        secret = localStorage.getItem('sessionIdApp');
      }
    }

    let decoded = {};
    const backEndUrl = getDynamicConfig().apiUrlRTSports;
    if ((!empty(localStorage.getItem('token')))) {
      headers.authorization = `bearer ${localStorage.getItem('token')}`;
      decoded = jwtDecode(localStorage.getItem('token'));
    }

    const response = await axios({
      url: `${backEndUrl}`,
      method: 'post',
      headers,
      data: {
        secret,
        query,
      },
    });

    // Cache the response
    if (response && response.data) {
      QueryCache.set(query, response.data);
    }

    return response;
  }
}

