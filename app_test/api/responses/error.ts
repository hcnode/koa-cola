import * as Koa from 'Koa';

export default function OkResponse(ctx : Koa.Context, error, status){
    status = status || 400;
    ctx.status = status;
    ctx.body = {
        code : status,
        error : error || ''
    };
}