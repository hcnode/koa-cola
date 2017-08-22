"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * koa-cola entry file
 */
const Koa = require("koa");
const chalk = require("chalk");
const http = require("http");
// import sessionRedis = require('koa-generic-session');
// import redisStore = require('koa-redis');
const session = require("koa-session");
const createSchemaTypes_1 = require("./util/createSchemaTypes");
const mountMiddleware_1 = require("./middlewares/mountMiddleware");
const serverRouter_1 = require("./middlewares/serverRouter");
const createErrorPage_1 = require("./util/createErrorPage");
const injectGlobal_1 = require("./util/injectGlobal");
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
function default_1(colaApp) {
    // add require css hook 否则使用ts-node启动有import css的ts文件会出错
    // 预处理的方式是直接删除，因为node里面正常情况下不需要使用import的css，而是由webpack处理
    const hook = require('css-modules-require-hook');
    hook({
        /**
         * @param  {string} css
         * @param  {string} filepath Absolute path to the file
         * @return {string}
         */
        preprocessCss: function (css, filepath) {
            return '';
        },
        extensions: ['.css', '.less', '.scss']
    });
    // 注入全局变量
    var routerRoutes = injectGlobal_1.default(colaApp);
    var koaApp = new Koa();
    // global.app.koaApp = koaApp
    // handle error, including 404
    // https://github.com/koajs/examples/issues/20
    koaApp.use(async function (ctx, next) {
        try {
            await next();
            if (!ctx.status || ctx.status == 404) {
                ctx.throw(404);
            }
        }
        catch (err) {
            ctx.status = err.status || 500;
            var env = process.env;
            try {
                if (env.NODE_ENV != 'test') {
                    console.log(require('util').inspect(err));
                }
            }
            catch (e) { }
            var message = err.message;
            if (err.status && !http.STATUS_CODES[err.status]) {
                message = require('statuses')[err.status] || 'unknow error';
            }
            // accepted types
            switch (ctx.accepts('text', 'json', 'html')) {
                case 'text':
                    ctx.body = message;
                    break;
                case 'json':
                    ctx.body = { error: message };
                    if (process.env.NODE_ENV != 'production') {
                        ctx.body.stack = err.stack;
                    }
                    break;
                case 'html':
                    createErrorPage_1.default({
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
        }
        else {
            // memory session
            koaApp.use(session(app.config.session, koaApp));
        }
    }
    // 加载中间件
    mountMiddleware_1.default(koaApp);
    // 加载路由
    koaApp.use(routerRoutes.routes());
    koaApp.use(routerRoutes.allowedMethods());
    // 加载react路由
    koaApp.use(serverRouter_1.default);
    // create schema types，生成typings/schema.ts
    createSchemaTypes_1.default();
    // error emit
    koaApp.on('error', function (err) {
        if (process.env.NODE_ENV != 'test') {
            // TODO
        }
    });
    // 调用config配置里面的boostrap
    try {
        require(`${process.cwd()}/config/bootstrap`)(koaApp);
    }
    catch (error) { }
    const port = process.env.PORT || app.config.port || 3000;
    return koaApp.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)));
}
exports.default = default_1;
