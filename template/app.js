if(require('./config/trace').googleTrace && process.env.GOOGLE_APPLICATION_CREDENTIALS){
  require('@google-cloud/trace-agent').start();
}
require('ts-node/register');
process.on('unhandledRejection', error => {
  console.log('unhandledRejection', require('util').inspect(error));
});
var { RunApp } = require('koa-cola');
RunApp();
