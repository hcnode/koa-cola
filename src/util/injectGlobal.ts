/**
 * 全局变量注入，启动时，koa-cola读取所依赖的的api相关对象都将读取app.xxx，而不是读基于文件的对象
 */

import { getConfig, getEnvironment } from './env'
import { reqDir } from './require';
import { bindRoutes } from 'controller-decorators';
import decorators from './decorators'
import * as Router from 'koa-router';
import createRouter from './createRouter'
import * as fs from 'fs'
export default function inject(colaApp?){
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
	var appConfig = getConfig();
	global.app.config = appConfig;
	// inject some decorators
	global.app.decorators = decorators
	
	try {
		var mongoose = require(`mongoose`);
		mongoose.Promise = global.Promise;
		global.app.mongoose = mongoose;
	} catch (error) {
		console.log(`mongoose not found`)
	}
	// 百事模式，只使用传进来的colaApp作为app配置
	if(colaApp && colaApp.mode == 'pepsi'){
		Object.assign(global.app, colaApp);
	}else{
		global.app = Object.assign(global.app,
			// load controllers
			{ controllers: reqDir(`${process.cwd()}/api/controllers`) },
			// load models
			{ models: reqDir(`${process.cwd()}/api/models`) },
			// load policies
			{ policies: reqDir(`${process.cwd()}/api/policies`) },
			// load services
			{ services: reqDir(`${process.cwd()}/api/services`) },
			// load managers
			{ managers: reqDir(`${process.cwd()}/api/managers`) },
			// load middlewares
			{ middlewares: reqDir(`${process.cwd()}/api/middlewares`) },
			// load responses
			{ responses: reqDir(`${process.cwd()}/api/responses`) },
			// load pages
			{ pages: reqDir(`${process.cwd()}/views/pages`) });
		if(colaApp){
			Object.keys(colaApp).forEach(key => {
				app[key] = app[key] || {};
				Object.assign(app[key], colaApp[key]);
			});
		}
	}
	// 没有放到顶部import是因为需要启动时import
	var logger = require('./logger').default;
	global.app.logger = logger;
	var controllers = app.controllers
    const routerRoutes = new Router();

    //bindRoutes(routerTable, controllers, getter) - Binds the controller to the route table.
    var routers = bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
    
	routerRoutes.stack.forEach((item => {
		console.log(`router:${item.methods.join('-')}:  ${item.path}`)
    }));

	app.reactRouters = routers;
	// fs.writeFileSync(`${process.cwd()}/routers.json`, JSON.stringify(routers, null, '\t'));
	// 创建react router和react provider
    createRouter(routers);

	return routerRoutes;
}