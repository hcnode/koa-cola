/**
 *
 */
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as Router from 'koa-router';
import * as http from 'http'
import createRouter from './util/createRouter'
import createMiddleware from './middlewares/createMiddleware'
import serverRouter from './middlewares/serverRouter'
import { loadModels } from './util/loadModels'

var requireDir = require('require-dir')
var { bindRoutes } = require('controller-decorators');
import { getConfig, getEnvironment } from './util/env'
import createErrorPage from './util/createErrorPage'
var appConfig = getConfig();
var koaApp = new Koa();
const port = process.env.PORT || appConfig.port;
// handle error, including 404
// https://github.com/koajs/examples/issues/20
koaApp.use(async function (ctx, next) {
	try {
		await next();
		if (!ctx.status || ctx.status == 404) {
			ctx.status = 404;
			ctx.throw(404);
		}
	} catch (err) {
		var env = process.env;
		// accepted types
		switch (ctx.accepts('text', 'json', 'html')) {
			case 'text':
				if ('development' == env) ctx.body = err.message
				else if (err.expose) ctx.body = err.message
				else throw err;
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
// koaApp.use(require('koa-route').get('/injectCtx', ctx => {ctx.status = 201;ctx.body = 'injectCtx'}))
// 以下开始自动router
var controllers = requireDir(`${process.cwd()}/api/controllers`);
const routerRoutes = new Router();
var routers = bindRoutes(routerRoutes, Object.keys(controllers).map(key => controllers[key].default));
// 创建react router和react provider

createRouter(routers);
// 必须在执行完bindRoutes后
createMiddleware(koaApp)
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

// load models
require('mongoose').Promise = global.Promise;
var app = Object.assign({}, loadModels());
global.app = app;

export default koaApp.listen(port, () => console.log(chalk.black.bgGreen.bold(`Listening on port ${port}`)));
// global.app = {
//     koa: app,
//     config: appConfig,
//     env: util.getEnvironment(),
//     cwd: process.cwd()
// };
// require('init');
// export default koaApp;
