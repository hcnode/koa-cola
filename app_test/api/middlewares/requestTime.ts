import * as Koa from 'koa';

export default function(){
    return async function requestTime(ctx : Koa.Context, next : any){
        ctx.state.middlewareOrders = ctx.state.middlewareOrders || [];
        ctx.state.middlewareOrders.push('requestTime');
        var startTime : any = new Date();
        await next();
        var endTime : any =  new Date();
        if(ctx.url == '/testMiddleware'){
            ctx.body = 'requestTime:' + (endTime - startTime);
        }
    }
}