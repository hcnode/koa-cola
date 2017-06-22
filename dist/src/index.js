"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * koa-cola entry file
 */
const Koa = require("koa");
const chalk = require("chalk");
const Router = require("koa-router");
const http = require("http");
const sessionRedis = require("koa-generic-session");
const redisStore = require("koa-redis");
const session = require("koa-session");
const createRouter_1 = require("./util/createRouter");
const createMiddleware_1 = require("./middlewares/createMiddleware");
const serverRouter_1 = require("./middlewares/serverRouter");
const controller_decorators_1 = require("controller-decorators");
const env_1 = require("./util/env");
const createErrorPage_1 = require("./util/createErrorPage");
const require_1 = require("./util/require");
const logger_1 = require("./util/logger");
const decorators_1 = require("./util/decorators");
var appConfig = env_1.getConfig();
var koaApp = new Koa();
global.app = {};
global.app.config = appConfig;
const port = process.env.PORT || appConfig.port;
// inject some decorators
global.app.decorators = decorators_1.default;
// load 全局对象
try {
    var mongoose = require(`mongoose`);
    mongoose.Promise = global.Promise;
    global.app.mongoose = mongoose;
}
catch (error) {
    console.log(`mongoose not found`);
    // global.app.mongoose = require('mongoose');
}
global.app = Object.assign(global.app, 
// load models
{ models: require_1.reqDir(`${process.cwd()}/api/models`) }, 
// load policies
{ policies: require_1.reqDir(`${process.cwd()}/api/policies`) }, 
// load services
{ services: require_1.reqDir(`${process.cwd()}/api/services`) }, 
// load managers
{ managers: require_1.reqDir(`${process.cwd()}/api/managers`) });
global.app.logger = logger_1.default;
global.app.koaApp = koaApp;
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
        // console.log(require('util').inspect(err))
        var env = process.env;
        // accepted types
        switch (ctx.accepts('text', 'json', 'html')) {
            case 'text':
                ctx.body = err.message;
                break;
            case 'json':
                if ('development' == env)
                    ctx.body = { error: err.message };
                else if (err.expose)
                    ctx.body = { error: err.message };
                else
                    ctx.body = { error: http.STATUS_CODES[ctx.status] };
                break;
            case 'html':
                createErrorPage_1.default({
                    env: env,
                    ctx: ctx,
                    error: err.message,
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
// koaApp.use(require('koa-response-time')());
// koaApp.use(require('koa-favicon')(require.resolve(`${process.cwd()}/public/favicon.ico`)));
// koaApp.use(require('koa-etag')());
// koaApp.use(require('koa-morgan')('combined', {
// 	stream: fs.createWriteStream(process.cwd() + '/logs/access.log',
// 		{ flags: 'a' })
// }));
// koaApp.use(require('koa-compress')({
// 	flush: require('zlib').Z_SYNC_FLUSH
// }));
// koaApp.use(require('koa-bodyparser')({
// 	// BodyParser options here
// }));
// koaApp.use(require('koa-static')(`${process.cwd()}/public`));
// session
if (app.config.session) {
    // redis session
    if (app.config.session.host) {
        koaApp.use(sessionRedis({
            store: redisStore(app.config.session)
        }));
    }
    else {
        // memory session
        koaApp.use(session(app.config.session, koaApp));
    }
}
// 自定义middleware在静态路由的后面
// TODO 考虑所有middleware都可以自定义顺序
createMiddleware_1.default(koaApp);
// koaApp.use(require('koa-route').get('/injectCtx', ctx => {ctx.status = 201;ctx.body = 'injectCtx'}))
// 以下开始自动router
var controllers = require_1.reqDir(`${process.cwd()}/api/controllers`);
const routerRoutes = new Router();
var routers = controller_decorators_1.bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
routerRoutes.stack.forEach((item => {
    console.log(`router:${item.methods.join('-')}:  ${item.path}`);
}));
// 创建react router和react provider
createRouter_1.default(routers);
// 必须在执行完bindRoutes后
koaApp.use(serverRouter_1.default);
// 在serverRouter后面，为了优先react router
koaApp.use(routerRoutes.routes());
koaApp.use(routerRoutes.allowedMethods());
// error emit
koaApp.on('error', function (err) {
    if (process.env.NODE_ENV != 'test') {
        // TODO
    }
});
// app bootstrap config
try {
    require(`${process.cwd()}/config/bootstrap`)(koaApp);
}
catch (error) { }
exports.default = koaApp.listen(port, () => console.log(chalk.white.bgBlue(`Listening on port ${port}`)));
