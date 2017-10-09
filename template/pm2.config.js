module.exports = {
  /**
 * Application configuration section
 * http://pm2.keymetrics.io/docs/usage/application-declaration/
 */
  apps: [
    // server
    {
      name: 'koa-cola-app',
      script: __dirname + '/app.ts',
      instances: 2,
      interpreter: 'ts-node',
      exec_mode: 'cluster'
    }
  ]
};
