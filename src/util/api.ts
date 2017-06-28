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
    if(ctx){
        req.url = `http://127.0.0.1:${app.config.port}${req.url}`;
        var cookie = ctx.req.headers.cookie;
        if(cookie){
            req.headers = {
                Cookie : cookie
            }
        }
    }
    var result = await axios(req)
    api.result = result.data;
    return api;
}