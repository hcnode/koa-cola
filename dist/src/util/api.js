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
        fetch(this);
    }
}
exports.Base = Base;
async function fetch(api) {
    var { url, method, body } = api;
    var args = [api.url];
    if (api.method.toLowerCase() == 'post') {
        args.push(api.body);
    }
    api.result = await axios[api.method](...args);
    return api;
}
exports.fetch = fetch;
