module.exports = {
	accessLogPath : __dirname + '/../accessLog',
	logPath : __dirname + '/../logs',
	tracer : {
		mongoUrl : 'mongodb://127.0.0.1:27017/koa-cola'
	}
}