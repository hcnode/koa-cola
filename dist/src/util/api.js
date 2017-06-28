"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
class Base {
    constructor(body) {
        this.url = '';
        this.method = 'get';
        this.body = body;
    }
    fetch(ctx) {
        return fetch(this, ctx);
    }
}
exports.Base = Base;
async function fetch(api, ctx) {
    var { url, method, body } = api;
    // var args : any = [api.url];
    var req = {
        url,
        method
    };
    if (api.method.toLowerCase() == 'post') {
        req.data = body;
    }
    else {
        if (Object.keys(api.body).length > 0) {
            req.url += (req.url.indexOf('?') == -1 ? '?' : '&') + Object.keys(api.body).map(field => `${field}=${api.body[field]}`).join('&');
        }
    }
    if (ctx) {
        req.url = `http://127.0.0.1:${app.config.port}${req.url}`;
        var cookie = ctx.req.headers.cookie;
        if (cookie) {
            req.headers = {
                Cookie: cookie
            };
        }
    }
    var result = await axios_1.default(req);
    api.result = result.data;
    return api;
}
exports.fetch = fetch;
