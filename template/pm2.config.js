module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// server
		{
			name: 'koa-cola-app',
			script: __dirname + '/node_modules/ts-node/dist/_bin.js',
			// instances: 2,
			exec_mode: 'fork',
			interpreter_args: '-r ts-node/register ./app.ts -F'
		}
	]
};