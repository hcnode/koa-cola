#!/usr/bin/env node

/*import App from '../dist/src/index';
var program = require('commander');

program
	.version('0.0.1')
	.command('open')
	.action(function () {
		App();
	});

program.parse(process.argv);*/

var shell = require('shelljs');
shell.exec(`node -r ts-node/register ${process.cwd()}/app.ts ${__dirname}/../node_modules/ts-node/dist/_bin.js`);