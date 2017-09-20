import { testSchema } from './typings/schema';
import { ApiBase, apiFetch } from '../client'
export interface ComposeBody{
    foo : string,
    bar? : number
}
export class Compose extends ApiBase<ComposeBody, testSchema, {}>{
    constructor(body : ComposeBody){
        super(body)
    }
    url : string = '/compose'
    method : string = 'post'
}

export class ServerCallApi extends ApiBase<{}, {}, {}>{
    constructor(body){
        super(body)
    }
    url : string = '/serverCallApi'
    method : string = 'get'
}


