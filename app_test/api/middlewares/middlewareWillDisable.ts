import * as Koa from 'Koa';

export default function(){
    return async function disabledMiddleware(ctx : Koa.Context, next : any){
        ctx.session.disabledMiddleware = 'enable';
        await next();
    }
}