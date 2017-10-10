/**
 * 数据api定义和封装，使用ts的泛型方式继承（类似java的泛形），可完美在vscode支持intellisense
 * 使用axios进行ajax通信，可同是支持node端和浏览器端
 * Base基类封装了api接口基本信息，包括：url，method，result等
 */
import axios from 'axios'

export class Base<B, R, E> {
    constructor(body : B){
        this.body = body;
    }
    url : string = ''
    method : string = 'get'
    body : B
    result : R
    exception : E
    fetch (ctx?){
        return fetch(this, ctx)
    }
}
/**
 * fetch请求数据
 * @param api 
 * @param ctx koa.Context对象，如果有ctx参数，表示在node端请求
 */
export async function fetch<B, R, E, A extends Base<B, R, E>>(api: A, ctx?): Promise<A> {
    var { url, method, body } = api;
    // var args : any = [api.url];
    var req : any = {
        url,
        method
    };
    if(api.method.toLowerCase() == 'post'){
        req.data = body;
    }else{
        if(Object.keys(api.body).length > 0){
            req.url += (req.url.indexOf('?') == -1 ? '?' : '&') + Object.keys(api.body).map(field => `${field}=${api.body[field]}`).join('&')
        }
    }
    req.url += (req.url.indexOf('?') > -1 ? '&' : '?') + `t=${new Date().valueOf()}`
    if(ctx){
        // 本地调用，并透穿cookie
        // 尝试使用request库并pipe完整的request，但是出现问题
        req.url = `http://127.0.0.1:${app.config.port}${req.url}`;
        if(ctx.req){
            var cookie = ctx.req.headers.cookie;
            if(cookie){
                req.headers = {
                    Cookie : cookie
                }
            }
        }
    }
    var result = await axios(req)
    api.result = result.data;
    return api;
}