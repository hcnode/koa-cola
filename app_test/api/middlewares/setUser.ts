/**
 * this middleware use commonjs module pattern
 */
import * as Koa from 'Koa';

export default async function setUser(ctx : Koa.Context , next){
    ctx.state.user = {name : 'harry'}
    await next();
}