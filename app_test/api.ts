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

export class FooApi1 extends ApiBase<{bar : string}, {koa : string}, {}>{
    constructor(body){
        super(body)
    }
    url : string = '/fooapi1'
    method : string = 'get'
}

export class FooApi2 extends ApiBase<{bar : string}, {koa : string}, {}>{
    constructor(body){
        super(body)
    }
    url : string = '/fooapi2'
    method : string = 'post'
}

