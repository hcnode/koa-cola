module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// server
		{
			name: 'koa-cola',
			script: __dirname + '/node_modules/ts-node/dist/_bin.js',
			instances: 2,
			exec_mode: 'cluster',
			env_production: {
				'NODE_ENV': 'production'
			},
			env_development: {
				'NODE_ENV': 'development'
			},
			env_local: {
				'NODE_ENV': 'local'
			},
			interpreter_args: '-r ts-node/register ./app.ts'
		}
	]
};