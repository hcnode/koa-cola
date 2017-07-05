import { getConfig, getEnvironment } from './env'
import { reqDir } from './require';

import decorators from './decorators'
export default function inject(){
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
		// load pages
		{ pages: reqDir(`${process.cwd()}/views/pages`) });
	
	// 没有放到顶部import是因为需要启动时import
	var logger = require('./logger').default;
	global.app.logger = logger;
}