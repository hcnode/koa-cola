module.exports = {
	// session: {
	// 	host: '127.0.0.1',
	// 	db: 1,
	// 	password: null
	// }
	session : {
		key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
		/** (number || 'session') maxAge in ms (default is 1 days) */
		/** 'session' will result in a cookie that expires when session/browser is closed */
		/** Warning: If a session cookie is stolen, this cookie will never expire */
		maxAge: 86400000,
		overwrite: true, /** (boolean) can overwrite or not (default true) */
		httpOnly: true, /** (boolean) httpOnly or not (default true) */
		signed: true, /** (boolean) signed or not (default true) */
	}
};