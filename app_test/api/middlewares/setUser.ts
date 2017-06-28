/**
 * this middleware use commonjs module pattern
 */
import * as Koa from 'koa';

export default async function setUser(ctx : Koa.Context , next){
    ctx.state.user = {name : 'harry'}
    await next();
}