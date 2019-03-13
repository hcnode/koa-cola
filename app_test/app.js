// require('@google-cloud/trace-agent').start({
//   projectId: 'kinetic-bot-231610',
//   keyFilename: '../../gdc-trace.json'
// });
require("ts-node/register");

process.on("unhandledRejection", error => {
  console.log("unhandledRejection", require("util").inspect(error));
});

var { RunApp } = require("../dist/");
RunApp();
