import * as Koa from 'Koa';

export default async function isLogin(ctx : Koa.Context, next : any){
    if(ctx.state.user){
        await next();
    }else{
        ctx.throw(401);
    }
}