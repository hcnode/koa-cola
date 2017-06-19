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
import sessionRedis = require('koa-generic-session');
import redisStore = require('koa-redis');
import session = require('koa-session');
import createRouter from './util/createRouter'
import createMiddleware from './middlewares/createMiddleware'
import serverRouter from './middlewares/serverRouter'
var { bindRoutes } = require('controller-decorators');
import { getConfig, getEnvironment } from './util/env'
import createErrorPage from './util/createErrorPage'
import { reqDir } from './util/require';
import logger from './util/logger';
import * as mongoose from 'mongoose';
var appConfig = getConfig();
var koaApp = new Koa();
global.app = {};
global.app.config = appConfig;
const port = process.env.PORT || appConfig.port;

// load 全局对象
require('mongoose').Promise = global.Promise;
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
		// console.log(require('util').inspect(err))
		var env = process.env;
		// accepted types
		switch (ctx.accepts('text', 'json', 'html')) {
			case 'text':
				ctx.body = err.message
				break;

			case 'json':
				if ('development' == env) ctx.body = { error: err.message }
				else if (err.expose) ctx.body = { error: err.message }
				else ctx.body = { error: http.STATUS_CODES[ctx.status] }
				break;

			case 'html':
				createErrorPage({
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
koaApp.use(require('koa-response-time')());
koaApp.use(require('koa-favicon')(require.resolve(`${process.cwd()}/public/favicon.ico`)));
koaApp.use(require('koa-etag')());
koaApp.use(require('koa-morgan')('combined', {
	stream: fs.createWriteStream(process.cwd() + '/logs/access.log',
		{ flags: 'a' })
}));
koaApp.use(require('koa-compress')({
	flush: require('zlib').Z_SYNC_FLUSH
}));
koaApp.keys = ['iTIssEcret'];
koaApp.use(require('koa-bodyparser')({
	// BodyParser options here
}));

koaApp.use(require('koa-static')(`${process.cwd()}/public`));
// session
if(app.config.session){
	// redis session
	if(app.config.session.host){
		koaApp.use(sessionRedis({
			store: redisStore(app.config.session)
		}));
	}else{
		// memory session
		koaApp.use(session(app.config.session, koaApp));
	}
}
// 自定义middleware在静态路由的后面
// TODO 考虑所有middleware都可以自定义顺序
createMiddleware(koaApp)
// koaApp.use(require('koa-route').get('/injectCtx', ctx => {ctx.status = 201;ctx.body = 'injectCtx'}))
// 以下开始自动router
var controllers = reqDir(`${process.cwd()}/api/controllers`);
const routerRoutes = new Router();
var routers = bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key]));
routerRoutes.stack.forEach((item => {
	console.log(`router:${item.methods.join('-')}:  ${item.path}`)
}))
// 创建react router和react provider

createRouter(routers);
// 必须在执行完bindRoutes后
koaApp.use(serverRouter);
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
	require(`${process.cwd()}/config/bootstrap`)(koaApp, mongoose);
} catch (error) {}

export default koaApp.listen(port, () => console.log(chalk.white.bgBlue(`Listening on port ${port}`)));

