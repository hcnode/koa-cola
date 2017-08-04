module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// server
		{
			name: 'koa-cola-app-test',
			script: __dirname + '/pm2.js',
			instances: 2,
			exec_mode: 'cluster'
		}
	]
};