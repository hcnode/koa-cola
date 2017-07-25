
import * as koa from 'koa';

export default function(){
    return async function checkUser(ctx : koa.Context , next){
        if(!ctx.state.user){
            switch (ctx.accepts('text', 'json', 'html')) {
                case 'json':
                    ctx.status = 401;
                    ctx.body = {code : 401};
                    break;
                default : 
                    ctx.redirect('/login');
                    break;
            }
            return;
        }
        await next();
    }
}