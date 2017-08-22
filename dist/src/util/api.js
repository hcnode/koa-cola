"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 数据api定义和封装，使用ts的泛型方式继承（类似java的泛形），可完美在vscode支持intellisense
 * 使用axios进行ajax通信，可同是支持node端和浏览器端
 * Base基类封装了api接口基本信息，包括：url，method，result等
 */
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
/**
 * fetch请求数据
 * @param api
 * @param ctx koa.Context对象，如果有ctx参数，表示在node端请求
 */
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
    req.url += (req.url.indexOf('?') > -1 ? '&' : '?') + `t=${new Date().valueOf()}`;
    if (ctx) {
        // 本地调用，并透穿cookie
        // 尝试使用request库并pipe完整的request，但是出现问题
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
