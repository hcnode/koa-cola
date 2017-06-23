import { testSchema } from './typings/schema';
import { ApiBase, fetch } from 'koa-cola'
export interface ComposeBody{
    foo? : string,
    bar? : number
}
class Base<B, R> {
    constructor(body : B){
        this.body = body;
    }
    url : string = ''
    method : string = 'get'
    body : B
    result : R
}
export class Compose extends Base<ComposeBody, testSchema>{
    url : string = '/componse'
    method : string = 'post'
}

export async function fetch<B, R, A extends Base<B, R>>(api: A): Promise<A> {
    var { url, method, body } = api;
    
    return api;
}
