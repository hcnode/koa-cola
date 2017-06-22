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
const mountMiddleware_1 = require("./middlewares/mountMiddleware");
const serverRouter_1 = require("./middlewares/serverRouter");
const controller_decorators_1 = require("controller-decorators");
const env_1 = require("./util/env");
const createErrorPage_1 = require("./util/createErrorPage");
const require_1 = require("./util/require");
const decorators_1 = require("./util/decorators");
function default_1() {
    var logger = require('./util/logger').default;
    // add require css hook 否则使用ts-node启动有import css的ts文件会出错
    // 预处理的方式是直接删除
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
    var appConfig = env_1.getConfig();
    var koaApp = new Koa();
    global.app = {};
    global.app.config = appConfig;
    if (global.globalConfig) {
        global.app.config = Object.assign(global.app.config, global.globalConfig);
    }
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
    global.app.logger = logger;
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
    // 加载中间件
    mountMiddleware_1.default(koaApp);
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
    return koaApp.listen(port, () => console.log(chalk.white.bgBlue(`Listening on port ${port}`)));
}
exports.default = default_1;
