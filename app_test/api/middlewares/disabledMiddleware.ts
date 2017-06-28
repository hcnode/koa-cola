import * as Koa from 'koa';

export default function(){
    return async function disabledMiddleware(ctx : Koa.Context, next : any){
        ctx.state.middlewareOrders = ctx.state.middlewareOrder || [];
        ctx.state.middlewareOrders.push('disabledMiddleware');
        await next();
        if(ctx.url == '/disabledMiddleware'){
            ctx.body = ctx.state.middlewareOrders.join('-');
        }

    }
}