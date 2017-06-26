"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
class Base {
    constructor(body) {
        this.url = '';
        this.method = 'get';
        this.body = body;
    }
    fetch() {
        return fetch(this);
    }
}
exports.Base = Base;
async function fetch(api) {
    var { url, method, body } = api;
    var args = [api.url];
    if (api.method.toLowerCase() == 'post') {
        args.push(api.body);
    }
    else {
        if (Object.keys(api.body).length > 0) {
            args[0] += (args[0].indexOf('?') == -1 ? '?' : '&') + Object.keys(api.body).map(field => `${field}=${api.body[field]}`).join('&');
        }
    }
    var result = await axios[api.method](...args);
    api.result = result.data;
    return api;
}
exports.fetch = fetch;
