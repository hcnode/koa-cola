import * as axios from 'axios'
export class Base<B, R, E> {
    constructor(body : B){
        this.body = body;
    }
    url : string = ''
    method : string = 'get'
    body : B
    result : R
    exception : E
    fetch (){
        return fetch(this)
    }
}
export async function fetch<B, R, E, A extends Base<B, R, E>>(api: A): Promise<A> {
    var { url, method, body } = api;
    var args : any = [api.url];
    if(api.method.toLowerCase() == 'post'){
        args.push(api.body);
    }else{
        if(Object.keys(api.body).length > 0){
            args[0] += (args[0].indexOf('?') == -1 ? '?' : '&') + Object.keys(api.body).map(field => `${field}=${api.body[field]}`).join('&')
        }
    }
    var result = await axios[api.method](...args)
    api.result = result.data;
    return api;
}