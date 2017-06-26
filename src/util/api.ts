import * as axios from 'axios'
export class Base<B, R> {
    constructor(body : B){
        this.body = body;
    }
    url : string = ''
    method : string = 'get'
    body : B
    result : R
    fetch (){
        return fetch(this)
    }
}
export async function fetch<B, R, A extends Base<B, R>>(api: A): Promise<A> {
    var { url, method, body } = api;
    var args : any = [api.url];
    if(api.method.toLowerCase() == 'post'){
        args.push(api.body);
    }
    api.result = await axios[api.method](...args)
    return api;
}