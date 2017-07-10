"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const require_1 = require("./require");
const controller_decorators_1 = require("controller-decorators");
const decorators_1 = require("./decorators");
const Router = require("koa-router");
const createRouter_1 = require("./createRouter");
const fs = require("fs");
function inject(colaApp) {
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
        console.log(`mongoose not found`);
    }
    // 百事模式，只使用传进来的colaApp作为app配置
    if (colaApp && colaApp.mode == 'pepsi') {
        Object.assign(global.app, colaApp);
    }
    else {
        global.app = Object.assign(global.app, 
        // load controllers
        { controllers: require_1.reqDir(`${process.cwd()}/api/controllers`) }, 
        // load models
        { models: require_1.reqDir(`${process.cwd()}/api/models`) }, 
        // load policies
        { policies: require_1.reqDir(`${process.cwd()}/api/policies`) }, 
        // load services
        { services: require_1.reqDir(`${process.cwd()}/api/services`) }, 
        // load managers
        { managers: require_1.reqDir(`${process.cwd()}/api/managers`) }, 
        // load middlewares
        { middlewares: require_1.reqDir(`${process.cwd()}/api/middlewares`) }, 
        // load responses
        { responses: require_1.reqDir(`${process.cwd()}/api/responses`) }, 
        // load pages
        { pages: require_1.reqDir(`${process.cwd()}/views/pages`) });
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
    var routers = controller_decorators_1.bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
    routerRoutes.stack.forEach((item => {
        console.log(`router:${item.methods.join('-')}:  ${item.path}`);
    }));
    fs.writeFileSync(`${process.cwd()}/routers.json`, JSON.stringify(routers, null, '/t'));
    // 创建react router和react provider
    createRouter_1.default(routers);
    return routerRoutes;
}
exports.default = inject;
