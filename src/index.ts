/**
 * koa-cola entry file
 */
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as Router from 'koa-router';
import * as koaBody from 'koa-body';
import * as http from 'http'
// import sessionRedis = require('koa-generic-session');
// import redisStore = require('koa-redis');
import session = require('koa-session');
import createRouter from './util/createRouter'
import createSchemaTypes from './util/createSchemaTypes'
import mountMiddleware from './middlewares/mountMiddleware'
import serverRouter from './middlewares/serverRouter'
import { bindRoutes } from 'controller-decorators';

import { getConfig, getEnvironment } from './util/env'
import createErrorPage from './util/createErrorPage'
import { reqDir } from './util/require';


import decorators from './util/decorators'

export default function () {
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

	var appConfig = getConfig();
	var koaApp = new Koa();
	global.app = {};
	global.app.config = appConfig;
	if (global.globalConfig) {
		global.app.config = Object.assign(global.app.config, global.globalConfig);
	}
	const port = process.env.PORT || appConfig.port;

	// inject some decorators
	global.app.decorators = decorators

	// load 全局对象
	try {
		var mongoose = require(`mongoose`);
		mongoose.Promise = global.Promise;
		global.app.mongoose = mongoose;
	} catch (error) {
		console.log(`mongoose not found`)
		// global.app.mongoose = require('mongoose');
	}
	global.app = Object.assign(global.app,
		// load models
		{ models: reqDir(`${process.cwd()}/api/models`) },
		// load policies
		{ policies: reqDir(`${process.cwd()}/api/policies`) },
		// load services
		{ services: reqDir(`${process.cwd()}/api/services`) },
		// load managers
		{ managers: reqDir(`${process.cwd()}/api/managers`) });

	global.app.logger = logger;
	global.app.koaApp = koaApp
	// handle error, including 404
	// https://github.com/koajs/examples/issues/20
	koaApp.use(async function (ctx, next) {
		try {
			await next();
			if (!ctx.status || ctx.status == 404) {
				ctx.throw(404);
			}
		} catch (err) {
			ctx.status = err.status || 500;
            console.log(require('util').inspect(err));
            var env = process.env;
            var message = err.message;
            if(!http.STATUS_CODES[err.status]){
                message = require('statuses')[err.status] || 'unknow error'
            }
            // accepted types
            switch (ctx.accepts('text', 'json', 'html')) {
                case 'text':
                    ctx.body = message;
                    break;
                case 'json':
                    ctx.body = { error: message };
                    break;
                case 'html':
                    createErrorPage({
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
	session
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
	mountMiddleware(koaApp)
	// 以下开始自动router
	var controllers = reqDir(`${process.cwd()}/api/controllers`);
	const routerRoutes = new Router();
	var routers = bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
	routerRoutes.stack.forEach((item => {
		console.log(`router:${item.methods.join('-')}:  ${item.path}`)
	}))
	// 创建react router和react provider

	// createRouter(routers);
	// 必须在执行完bindRoutes后
	koaApp.use(serverRouter);
	// 在serverRouter后面，为了优先react router
	koaApp.use(routerRoutes.routes());
	koaApp.use(routerRoutes.allowedMethods());

	// create schema types
	createSchemaTypes();
	// error emit
	koaApp.on('error', function (err) {
		if (process.env.NODE_ENV != 'test') {
			// TODO
		}
	});
	// app bootstrap config
	try {
		require(`${process.cwd()}/config/bootstrap`)(koaApp);
	} catch (error) { }

	return koaApp.listen(port, () => console.log(chalk.white.bgBlue(`Listening on port ${port}`)));
}

