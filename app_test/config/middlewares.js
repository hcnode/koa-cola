/**
 * default middlewares
 * var middlewaresConfig = [
    {
        name : 'koa-response-time',
        func : require('koa-response-time')
    },
    {
        name : 'koa-favicon',
        func : require('koa-favicon'),
        args : require.resolve(`${process.cwd()}/public/favicon.ico`))
    },
    {
        name : 'koa-etag',
        func : require('koa-etag')
    },
    {
        name : 'koa-morgan',
        func : function (args) {
            !fs.existsSync(args) && fs.mkdirSync(args);
            return require('koa-morgan')(args);
        },
        args : process.cwd() + '/logs'
    },
    {
        name : 'koa-compress',
        func : require('koa-compress'),
        args : {
            flush: require('zlib').Z_SYNC_FLUSH
        }
    },
    {
        name : 'koa-bodyparser',
        func : require('koa-bodyparser'),
        args : {}
    },
]
 */
module.exports = {
	middlewares : {
		checkMiddlewareOrder : true,
		requestTime : true,
		disabledMiddleware : false,
		sessionTest : true,
		middlewareWillDisable : true
	},
	sort : function(middlewares){
		return middlewares;
	}
};