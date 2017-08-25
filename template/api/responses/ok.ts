/**
 * 返回body的结构，可以在controller通过decorator方式定义该路由的返回结构，如：
 *  @Get('/getOkResponse')
    @Response(Ok)
    getOkResponse () {
        return {
            value : 'test'
        };
    }
 */
import * as Koa from 'koa';

export default function Ok(ctx : Koa.Context, data){
    ctx.status = 200;
    if(data){
        ctx.body = {
            code : 200,
            result : data
        };
    }
}