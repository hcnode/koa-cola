import * as Koa from 'Koa';

export default function isLogin(ctx : Koa.Context, next : any){
    if(ctx.state.user){
        next();
    }else{
        ctx.throw(401);
    }
}