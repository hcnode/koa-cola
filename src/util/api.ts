export class Base<B, R> {
    constructor(body : B){
        this.body = body;
    }
    url : string = ''
    method : string = 'get'
    body : B
    result : R
}
export async function fetch<B, R, A extends Base<B, R>>(api: A): Promise<A> {
    var { url, method, body } = api;
    
    return api;
}