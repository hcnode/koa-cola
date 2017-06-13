/**
 * this middleware use commonjs module pattern
 */
import * as Koa from 'Koa';

export default function setUser(ctx : Koa.Context , next){
    ctx.state.user = {name : 'harry'}
    next();
}