"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * koa-cola entry file
 */
const Koa = require("koa");
const chalk = require("chalk");
const http = require("http");
const session = require("koa-session");
const createSchemaTypes_1 = require("./util/createSchemaTypes");
const mountMiddleware_1 = require("./middlewares/mountMiddleware");
const serverRouter_1 = require("./middlewares/serverRouter");
const createErrorPage_1 = require("./util/createErrorPage");
const injectGlobal_1 = require("./util/injectGlobal");
const klg_tracer_1 = require("klg-tracer");
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
    // 注入全局变量
    var routerRoutes = injectGlobal_1.default(colaApp);
    if (app.config.tracer && process.env.NODE_ENV != 'test') {
        new klg_tracer_1.TraceService().registerHooks({
            httpServer: {
                useKoa: true,
                Koa
                // 过滤器，只记录特定接口, 注意 return true 的才会被过滤
                //   requestFilter: function (req) {
                //     const urlParsed = url.parse(req.url, true);
                //     return urlParsed.pathname.indexOf('product/') === -1;
                //   }
            },
            mongodb: {
                enabled: true,
                options: {
                    useMongoose: true,
                    mongodb: require('mongodb')
                }
            }
        }).registerMongoReporter({
            mongoUrl: app.config.tracer.mongoUrl,
            collectionName: 'tracer'
        });
    }
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
        }
        catch (err) {
            var env = process.env;
            var status = err.status;
            if (!status && err.message) {
                status = /invalid status code: (\d+)/.test(err.message) && (RegExp.$1);
                if (status) {
                    status -= 0;
                }
            }
            if (app.config.httpCodes) {
                var statuses = require('statuses');
                Object.assign(statuses, app.config.httpCodes);
                // statuses['450'] = 'this is custom http status code';
            }
            try {
                ctx.status = status;
            }
            catch (e) {
                ctx.status = 500;
            }
            var message = err.message;
            if (status && !http.STATUS_CODES[status]) {
                message = require('statuses')[status] || 'unknow error';
            }
            if (typeof message == 'object') {
                message = JSON.stringify(message);
            }
            // accepted types
            switch (ctx.accepts('text', 'json', 'html')) {
                case 'text':
                    ctx.body = message;
                    break;
                case 'json':
                    ctx.body = { error: message, code: ctx.status };
                    if (process.env.NODE_ENV != 'production') {
                        ctx.body.stack = err.stack;
                    }
                    break;
                case 'html':
                    await createErrorPage_1.default({
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
        /* istanbul ignore if */
        if (process.env.NODE_ENV != 'test') {
            console.log(require('util').inspect(err));
        }
    });
    // 调用config配置里面的boostrap
    var server = http.createServer(koaApp.callback());
    try {
        require(`${process.cwd()}/config/bootstrap`)(koaApp, server);
    }
    catch (error) { }
    const port = process.env.PORT || app.config.port || 3000;
    return server.listen(port, () => console.log(chalk.green(`Listening on port ${port}`)));
}
exports.default = default_1;
//# sourceMappingURL=index.js.map