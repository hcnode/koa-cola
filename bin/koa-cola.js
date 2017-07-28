#!/usr/bin/env ts-node

var program = require('commander');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var chalk = require('chalk');
var createSchemaTypes = require('../dist/src/util/createSchemaTypes').default;

program
	.version('0.1.7')
	.option('-n, --new [name]', 'new koa-cola project')
	.option('-c, --cheer', 'build webpack bundle and launch app')
	.option('-s, --schema', 'create model schemas')
	.parse(process.argv);
/**
 * 使用命令新建koa-cola项目，自动创建模版文件，并自动安装依赖，自动运行
 * koa-cola --new app
 */
if (program.new) {
	var name = program.new;
	var projectPath = path.join(process.cwd(), name);
	var templatePath = path.join(__dirname, '../', 'template');
	if(fs.existsSync(projectPath)){
		console.log(chalk.red('project exists : ' + projectPath));
	}else{
		// copy boilerplate project
		shell.cp('-R', templatePath, projectPath);
		// fs.copySync(templatePath, projectPath);
		console.log(chalk.green(`project ${name} created.`));
		console.log(chalk.green('now npm installing... please wait a moment.'));
		shell.cd(`${projectPath}`);
		shell.exec('npm install');
		console.log(chalk.green('npm install done. '));
		console.log(chalk.green('now webpack building project... please wait a moment.'));
		shell.exec('npm run open');
	}
} else if(program.cheer){
	shell.exec('webpack;koa-cola');
} else if(program.schema){
	createSchemaTypes();
}else {
	shell.exec(`${__dirname}/../node_modules/ts-node/dist/bin.js -F ${process.cwd()}/app.ts`);
}