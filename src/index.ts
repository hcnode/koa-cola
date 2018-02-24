/**
 * koa-cola entry file
 */
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as http from 'http';
// import sessionRedis = require('koa-generic-session');
// import redisStore = require('koa-redis');
import session = require('koa-session');
import createRouter from './util/createRouter'
import createSchemaTypes from './util/createSchemaTypes'
import mountMiddleware from './middlewares/mountMiddleware'
import serverRouter from './middlewares/serverRouter'
import { bindRoutes } from 'controller-decorators';

import createErrorPage from './util/createErrorPage'
import injectGlobal from './util/injectGlobal';
import { reqDir } from './util/require';
/**
 * colaApp 参数，可以作为可选的注入方式覆盖app的文件配置，module替换
 * 
 * {
 * 		config : {
 * 			foo : 'hello world' // 将会替换app.config.foo 
 * 		},
 * 		controllers : {
 * 			FooController :  // 替换api/controllers/FooController.ts
 * 		},
 * 		middlewares : {
 * 			...
 * 		},
 * 		models : {
 * 			...
 * 		},
 * 		pages : {
 * 			...
 * 		},
 * 		routers : {
 * 			...
 * 		}
 * }
 * @param colaApp 
 */
export default function (colaApp?) {

    
    // 注入全局变量
    var routerRoutes = injectGlobal(colaApp); 

    var koaApp = new Koa();
    // global.app.koaApp = koaApp
    // handle error, including 404
    // https://github.com/koajs/examples/issues/20
    koaApp.use(async function (ctx, next) {
        try {
            await next();
            if (!ctx.status || ctx.status > 399) {
                ctx.throw(ctx.status);
            }
        } catch (err) {
            var env = process.env;
            var status = err.status;
            if (!status && err.message) {
                status = /invalid status code: (\d+)/.test(err.message) && (RegExp.$1);
                if(status){
                    status -= 0;
                }
            }
            if(app.config.httpCodes){
                var statuses = require('statuses');
                Object.assign(statuses, app.config.httpCodes);
                // statuses['450'] = 'this is custom http status code';
            }
            try {
                ctx.status = status;
            } catch (e) {
                ctx.status = 500;
            }
            var message = err.message;
            if (status && !http.STATUS_CODES[status]) {
                message = require('statuses')[status] || 'unknow error';
            }
            if(typeof message == 'object'){
                message = JSON.stringify(message);
            }
            // accepted types
            switch (ctx.accepts('text', 'json', 'html')) {
                case 'text':
                    ctx.body = message;
                    break;
                case 'json':
                    ctx.body = { error: message };
                    if(process.env.NODE_ENV != 'production'){
                        ctx.body.stack = err.stack;
                    }
                    break;
                case 'html':
                    await createErrorPage({
                        env: env,
                        ctx: ctx,
                        error: message,
                        stack: err.stack,
                        status: ctx.status,
                        code: ctx.status
                    });
                    break;
            }

            // since we handled this manually we'll
            // want to delegate to the regular app
            // level error handling as well so that
            // centralized still functions correctly.
            ctx.app.emit('error', err, ctx);
        }
    });
    koaApp.keys = ['iTIssEcret'];
    if (app.config.session) {
        // redis session
        if (app.config.session.host) {
            // koaApp.use(sessionRedis({
            // 	store: redisStore(app.config.session)
            // }));
        } else {
            // memory session
            koaApp.use(session(app.config.session, koaApp));
        }
    }
    // 加载中间件
    mountMiddleware(koaApp);
    // 加载路由
    koaApp.use(routerRoutes.routes());
    koaApp.use(routerRoutes.allowedMethods());
    // 加载react路由
    koaApp.use(serverRouter);

    // create schema types，生成typings/schema.ts
    createSchemaTypes();
    // error emit
    koaApp.on('error', function (err) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV != 'test') {
            console.log(require('util').inspect(err));
        }
    });
    // 调用config配置里面的boostrap
    try {
        require(`${process.cwd()}/config/bootstrap`)(koaApp);
    } catch (error) { }
    const port = process.env.PORT || app.config.port || 3000;
    return koaApp.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)));
}

