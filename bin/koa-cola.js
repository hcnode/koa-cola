#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var chalk = require('chalk');
var createSchemaTypes = require('../dist/src/util/createSchemaTypes').default;

program
  .option('n, new [name]', 'new koa-cola project')
  .option('c, cheer', 'build webpack bundle and launch app')
  .option('s, schema', 'create model schemas')
  .option('-m, --mode [mode]', 'create new project mode')
  .parse(process.argv);
/**
 * 使用命令新建koa-cola项目，自动创建模版文件，并自动安装依赖，自动运行
 * koa-cola --new app
 */
if (program.new) {
  var name = program.new,
    templatePath;
  var projectPath = path.join(process.cwd(), name);
  if (program.mode && program.mode == 'api') {
    templatePath = path.join(__dirname, 'api');
    shell.cp('-R', templatePath, projectPath);
    var packageFile = path.join(projectPath, 'package.json');
    fs.writeFileSync(packageFile, fs.readFileSync(packageFile).toString().replace('#{name}', name));
    console.log(chalk.green(`project ${name} created with api mode.`));
    console.log(chalk.green('now npm installing... please wait a moment.'));
    shell.cd(`${projectPath}`);
    shell.exec('npm install');
    console.log(chalk.green('npm install done. '));
    shell.exec('koa-cola');
  } else {
    templatePath = path.join(__dirname, '../', 'template');
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red('project exists : ' + projectPath));
    } else {
      // copy boilerplate project
      shell.cp('-R', templatePath, projectPath);
      // fs.copySync(templatePath, projectPath);
      console.log(chalk.green(`project ${name} created with normal mode.`));
      console.log(chalk.green('now npm installing... please wait a moment.'));
      shell.cd(`${projectPath}`);
      shell.exec('npm install');
      console.log(chalk.green('npm install done. '));
      // console.log(chalk.green('now webpack building project... please wait a moment.'));
      // shell.exec('npm run open');
    }
  }
} else if (program.cheer) {
  shell.exec('webpack');
  shell.exec('koa-cola');
} else if (program.schema) {
  createSchemaTypes();
} else {
  if (fs.existsSync(`${process.cwd()}/app.ts`)) {
    shell.exec(
      `ts-node -F ${process.cwd()}/app.ts`
    );
  } else if (fs.existsSync(`${process.cwd()}/app.tsx`)) {
    shell.exec(
      `ts-node -F ${process.cwd()}/app.tsx`
    );
  } else {
    console.log(chalk.red(`${process.cwd()}/app.ts(x) not found`));
  }
}
