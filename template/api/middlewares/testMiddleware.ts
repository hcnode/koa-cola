import * as Koa from 'koa';

export default function(){
    return async function requestTime(ctx : Koa.Context, next : any){
        await next();
    }
}