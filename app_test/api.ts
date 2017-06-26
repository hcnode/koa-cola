import { testSchema } from './typings/schema';
import { ApiBase, apiFetch } from 'koa-cola'
export interface ComposeBody{
    foo? : string,
    bar? : number
}
export class Compose extends ApiBase<ComposeBody, testSchema>{
    url : string = '/componse'
    method : string = 'post'
}

