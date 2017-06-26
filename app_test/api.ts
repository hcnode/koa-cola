import { testSchema } from './typings/schema';
import { ApiBase, apiFetch } from 'koa-cola'
export interface ComposeBody{
    foo? : string,
    bar? : number
}
export class Compose extends ApiBase<ComposeBody, testSchema>{
    constructor(body){
        super(body)
    }
    url : string = '/compose'
    method : string = 'post'
}

