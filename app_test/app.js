require('@google-cloud/trace-agent').start({
  projectId: 'graphic-cosmos-269121',
  keyFilename: '../../../IAM/trace.json'
});
require('ts-node/register');

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', require('util').inspect(error));
});

var { RunApp } = require('../dist/');
RunApp();
