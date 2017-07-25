#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var chalk = require('chalk');

program
	.version('0.1.6')
	.option('-n, --new [name]', 'new koa-cola project')
	.parse(process.argv);

if (program.new) {
	var name = program.new;
	var projectPath = path.join(process.cwd(), name);
	var templatePath = path.join(__dirname, '../', 'template');
	if(fs.existsSync(projectPath)){
		console.log('project exists : ' + projectPath);
	}else{
		shell.cp('-R', templatePath, projectPath);
		// fs.copySync(templatePath, projectPath);
		console.log(chalk.blue(`project ${name} created.`));
		console.log(chalk.blue('now npm installing... please wait a moment.'));
		shell.cd(`${projectPath}`);
		shell.exec('npm install');
		console.log(chalk.blue('npm install done. '));
		console.log(chalk.blue('now webpack building project... please wait a moment.'));
		shell.exec('npm run open');
	}
} else {
	shell.exec(`node -r ts-node/register ${process.cwd()}/app.ts ${__dirname}/../node_modules/ts-node/dist/_bin.js`);
}