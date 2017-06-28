import * as Koa from 'koa';

export default function(){
    return async function disabledMiddleware(ctx : Koa.Context, next : any){
        ctx.session.disabledMiddleware = 'enable';
        await next();
    }
}