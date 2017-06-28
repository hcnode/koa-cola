"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * koa-cola entry file
 */
var Koa = require("koa");
var chalk = require("chalk");
var Router = require("koa-router");
var http = require("http");
// import sessionRedis = require('koa-generic-session');
// import redisStore = require('koa-redis');
var session = require("koa-session");
var createRouter_1 = require("./util/createRouter");
var createSchemaTypes_1 = require("./util/createSchemaTypes");
var mountMiddleware_1 = require("./middlewares/mountMiddleware");
var serverRouter_1 = require("./middlewares/serverRouter");
var controller_decorators_1 = require("controller-decorators");
var env_1 = require("./util/env");
var createErrorPage_1 = require("./util/createErrorPage");
var require_1 = require("./util/require");
var decorators_1 = require("./util/decorators");
function default_1() {
    var logger = require('./util/logger').default;
    // add require css hook 否则使用ts-node启动有import css的ts文件会出错
    // 预处理的方式是直接删除
    var hook = require('css-modules-require-hook');
    hook({
        /**
         * @param  {string} css
         * @param  {string} filepath Absolute path to the file
         * @return {string}
         */
        preprocessCss: function preprocessCss(css, filepath) {
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
    var port = process.env.PORT || appConfig.port;
    // inject some decorators
    global.app.decorators = decorators_1.default;
    // load 全局对象
    try {
        var mongoose = require("mongoose");
        mongoose.Promise = global.Promise;
        global.app.mongoose = mongoose;
    } catch (error) {
        console.log("mongoose not found");
        // global.app.mongoose = require('mongoose');
    }
    global.app = Object.assign(global.app,
    // load models
    { models: require_1.reqDir(process.cwd() + "/api/models") },
    // load policies
    { policies: require_1.reqDir(process.cwd() + "/api/policies") },
    // load services
    { services: require_1.reqDir(process.cwd() + "/api/services") },
    // load managers
    { managers: require_1.reqDir(process.cwd() + "/api/managers") });
    global.app.logger = logger;
    global.app.koaApp = koaApp;
    // handle error, including 404
    // https://github.com/koajs/examples/issues/20
    koaApp.use(function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
            var env;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;
                            _context.next = 3;
                            return next();

                        case 3:
                            if (!ctx.status || ctx.status == 404) {
                                ctx.throw(404);
                            }
                            _context.next = 21;
                            break;

                        case 6:
                            _context.prev = 6;
                            _context.t0 = _context["catch"](0);

                            ctx.status = _context.t0.status || 500;
                            console.log(require('util').inspect(_context.t0));
                            env = process.env;
                            // accepted types

                            _context.t1 = ctx.accepts('text', 'json', 'html');
                            _context.next = _context.t1 === 'text' ? 14 : _context.t1 === 'json' ? 16 : _context.t1 === 'html' ? 18 : 20;
                            break;

                        case 14:
                            ctx.body = _context.t0.message;
                            return _context.abrupt("break", 20);

                        case 16:
                            if ('development' == env) ctx.body = { error: _context.t0.message };else if (_context.t0.expose) ctx.body = { error: _context.t0.message };else ctx.body = { error: http.STATUS_CODES[ctx.status] };
                            return _context.abrupt("break", 20);

                        case 18:
                            createErrorPage_1.default({
                                env: env,
                                ctx: ctx,
                                error: _context.t0.message,
                                stack: _context.t0.stack,
                                status: ctx.status,
                                code: ctx.status
                            });
                            return _context.abrupt("break", 20);

                        case 20:
                            // since we handled this manually we'll
                            // want to delegate to the regular app
                            // level error handling as well so that
                            // centralized still functions correctly.
                            ctx.app.emit('error', _context.t0, ctx);

                        case 21:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, this, [[0, 6]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
    koaApp.keys = ['iTIssEcret'];
    session;
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
    mountMiddleware_1.default(koaApp);
    // 以下开始自动router
    var controllers = require_1.reqDir(process.cwd() + "/api/controllers");
    var routerRoutes = new Router();
    var routers = controller_decorators_1.bindRoutes(routerRoutes, Object.keys(controllers).map(function (key) {
        return controllers[key];
    }));
    routerRoutes.stack.forEach(function (item) {
        console.log("router:" + item.methods.join('-') + ":  " + item.path);
    });
    // 创建react router和react provider
    createRouter_1.default(routers);
    // 必须在执行完bindRoutes后
    koaApp.use(serverRouter_1.default);
    // 在serverRouter后面，为了优先react router
    koaApp.use(routerRoutes.routes());
    koaApp.use(routerRoutes.allowedMethods());
    // create schema types
    createSchemaTypes_1.default();
    // error emit
    koaApp.on('error', function (err) {
        if (process.env.NODE_ENV != 'test') {
            // TODO
        }
    });
    // app bootstrap config
    try {
        require(process.cwd() + "/config/bootstrap")(koaApp);
    } catch (error) {}
    return koaApp.listen(port, function () {
        return console.log(chalk.white.bgBlue("Listening on port " + port));
    });
}
exports.default = default_1;