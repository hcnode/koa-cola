import { ApiBase, apiFetch } from 'koa-cola/client'
export class GetFooApi extends ApiBase<{}, {}, {}>{
    constructor(body){
        super(body)
    }
    url : string = '/getFooApi'
    method : string = 'get'
}


