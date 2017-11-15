"use strict";
/**
 * 全局变量注入，启动时，koa-cola读取所依赖的的api相关对象都将读取app.xxx，而不是读基于文件的对象
 */
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const require_1 = require("./require");
const controller_decorators_1 = require("controller-decorators");
const decorators_1 = require("./decorators");
const Router = require("koa-router");
const createRouter_1 = require("./createRouter");
const fs = require("fs");
function inject(colaApp) {
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
    global.app = {};
    /**
     * 配置目录结构依赖的格式
     * 通过约定config目录下所有文件都会成为config的属性，并且会被env环境下的配置覆盖。
     * > app root
     * 	> config
     * 	 > env
     *    local.js
     * 	  test.js
     *    development.js
     *    production.js
     *   any_config_you_need.js
     *   ...
     *
     * any_config_you_need.js samples
     *
     * exports.module = {
     * 		foo : 'bar'
     * }
     *
     * 代码使用以上config: app.config.foo == bar
     * 如果当前是development环境，并且config/env/development.js:
     * exports.module = {
     * 		foo : 'wow'
     * }
     * 那么app.config.foo == 'wow'
     */
    var appConfig = env_1.getConfig();
    global.app.config = appConfig;
    // inject some decorators
    global.app.decorators = decorators_1.default;
    try {
        var mongoose = require(`mongoose`);
        mongoose.Promise = global.Promise;
        global.app.mongoose = mongoose;
    }
    catch (error) {
        /* istanbul ignore next */
        console.log(`mongoose not found`);
    }
    // 百事模式，只使用传进来的colaApp作为app配置
    if (colaApp && colaApp.mode == 'pepsi') {
        Object.assign(global.app, colaApp);
    }
    else {
        var cwd = process.cwd();
        var modulesMap = {
            controllers: '/api/controllers',
            models: '/api/models',
            policies: '/api/policies',
            services: '/api/services',
            managers: '/api/managers',
            middlewares: '/api/middlewares',
            responses: '/api/responses',
            schemas: '/api/schemas',
            pages: '/views/pages',
        };
        var modules = Object.keys(modulesMap).reduce((_modules, key) => {
            var reqPath = `${cwd}${modulesMap[key]}`;
            if (env_1.getEnvironment() != 'production' && fs.existsSync(reqPath) && process.env.KOA_COLA_CACHE == 'no') {
                fs.watch(reqPath, {}, (eventType, filename) => {
                    if (eventType == 'change') {
                        try {
                            global.app[key] = require_1.reqDir(reqPath);
                        }
                        catch (e) {
                            /* istanbul ignore next */
                            console.log(`refresh module '${key}' error`);
                        }
                    }
                });
            }
            try {
                _modules[key] = require_1.reqDir(reqPath);
            }
            catch (e) {
                /* istanbul ignore next */
                console.log(`load module '${key}' error`);
            }
            return _modules;
        }, {});
        global.app = Object.assign(global.app, 
        // // load controllers
        // { controllers: reqDir(`${cwd}/api/controllers`) },
        // // load models
        // { models: reqDir(`${cwd}/api/models`) },
        // // load policies
        // { policies: reqDir(`${cwd}/api/policies`) },
        // // load services
        // { services: reqDir(`${cwd}/api/services`) },
        // // load managers
        // { managers: reqDir(`${cwd}/api/managers`) },
        // // load middlewares
        // { middlewares: reqDir(`${cwd}/api/middlewares`) },
        // // load responses
        // { responses: reqDir(`${cwd}/api/responses`) },
        // // load schema
        // { schemas: reqDir(`${cwd}/api/schemas`) },
        // // load pages
        // { pages: reqDir(`${cwd}/views/pages`) }
        modules);
        if (colaApp) {
            Object.keys(colaApp).forEach(key => {
                app[key] = app[key] || {};
                Object.assign(app[key], colaApp[key]);
            });
        }
    }
    // 没有放到顶部import是因为需要启动时import
    var logger = require('./logger').default;
    global.app.logger = logger;
    var controllers = app.controllers;
    const routerRoutes = new Router();
    //bindRoutes(routerTable, controllers, getter) - Binds the controller to the route table.
    var routers = controller_decorators_1.bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
    routerRoutes.stack.forEach((item => {
        console.log(`router:${item.methods.join('-')}:  ${item.path}`);
    }));
    app.reactRouters = routers;
    // fs.writeFileSync(`${process.cwd()}/routers.json`, JSON.stringify(routers, null, '\t'));
    // 创建react router和react provider
    createRouter_1.default(routers);
    return routerRoutes;
}
exports.default = inject;
//# sourceMappingURL=injectGlobal.js.map