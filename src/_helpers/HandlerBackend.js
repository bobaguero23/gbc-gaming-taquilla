import empty from 'is-empty';
import axios from 'axios'
import config from 'config';
import jwt_decode from 'jwt-decode';


import { getDynamicConfig } from './dynamicConfig';

export default class HandlerBackend {

    static sendRequest = async ({ query, path, params } = { query, path, params }) => {

        let headers = {
            'Content-Type': 'application/json'
        }

        let secret = '';
        let decoded = {};

        if ((!empty(localStorage.getItem('token')))) {
            headers.authorization = "bearer " + localStorage.getItem('token')
            decoded = jwt_decode(localStorage.getItem('token'));
        }

        let backEndUrl = getDynamicConfig().apiUrlBackEnd + path;

        if (!empty(decoded) && (!empty(decoded.backend_url))) {
            backEndUrl = `${decoded.backend_url + path}`;
        }

        return await axios({
            url: `${backEndUrl}`,
            method: 'post',
            headers,
            data: {
                secret,
                query: query,
                params: params
            }
        })

    }

    static sendRequestLocal = async ({ query, path } = { query, path }) => {

        let headers = {
            'Content-Type': 'application/json'
        }

        let secret = '';
        let decoded = {};

        if ((!empty(localStorage.getItem('token')))) {
            headers.authorization = "bearer " + localStorage.getItem('token')
            decoded = jwt_decode(localStorage.getItem('token'));
        }

        if ((!empty(localStorage.getItem('tokenCore')))) {
            headers.authorizationcore = localStorage.getItem('tokenCore')
        }

        let backEndUrl = 'http://localhost:8006' + path;

        return await axios({
            url: `${backEndUrl}`,
            method: 'post',
            headers,
            data: {
                secret,
                query: query
            }
        })

    }


}