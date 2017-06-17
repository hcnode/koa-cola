import * as Koa from 'Koa';

export default async function disabledMiddleware(ctx : Koa.Context, next : any){
    ctx.session.disabledMiddleware = 'enable';
    await next();
}