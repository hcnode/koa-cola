"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(body) {
        this.url = '';
        this.method = 'get';
        this.body = body;
    }
}
exports.Base = Base;
async function fetch(api) {
    var { url, method, body } = api;
    return api;
}
exports.fetch = fetch;
