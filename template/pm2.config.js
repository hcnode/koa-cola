module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// server
		{
			name: 'koa-cola-todolist',
			script: __dirname + '/node_modules/ts-node/dist/_bin.js',
			instances: 2,
			exec_mode: 'cluster',
			interpreter_args: '-r ts-node/register ./app.ts -F'
		}
	]
};