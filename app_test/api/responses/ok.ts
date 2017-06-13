import * as Koa from 'Koa';

export default function Ok(ctx : Koa.Context, data){
    ctx.status = 200;
    if(data){
        ctx.body = {
            code : 200,
            result : data
        };
    }
}