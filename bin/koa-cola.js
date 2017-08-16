#!/usr/bin/env ts-node

var program = require('commander');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var chalk = require('chalk');
var { reqDir } = require('../dist/src/util/require');
var inject = require('../dist').injectGlobal;
var createSchemaTypes = require('../dist/src/util/createSchemaTypes').default;
const openBrowser = require('react-dev-utils/openBrowser');
var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];
if (major < 7) {
  console.error(
    chalk.red(
      'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'koa-cola requires Node 7 or higher. \n' +
        'Please update your version of Node.'
    )
  );
  process.exit(1);
}
program
  .option('n, new [name]', 'new koa-cola project')
  .option('c, cheer', 'build webpack bundle and launch app')
  .option('s, schema', 'create model schemas')
  .option('b, build', 'build webpack bundle')
  .option('d, dev', 'launch development')
  .option('-w, watch', 'build webpack bundle and watch')
  .option('-p, production', 'build webpack production bundle')
  .option('-m, --mode [mode]', 'create new project mode')
  .parse(process.argv);

function build({watch, production} = {}){
  watch = watch || program.watch;
  production = production || program.production;
  var appTsx = path.join(__dirname, 'app.tsx');
  var projectAppTsxPath = path.join(process.cwd(), 'views', 'app.tsx');
  if(!fs.existsSync(path.join(process.cwd(), 'views'))){
    console.log(chalk.red(path.join(process.cwd(), 'views') + ' not found'));
    process.exit(1);
  }else{
    shell.cp(appTsx, projectAppTsxPath);
    var controllers = reqDir(path.join(process.cwd(), 'api', 'controllers'));
    var controllersStr = Object.keys(controllers).map(ctrl => {
      return `require('../api/controllers/${ctrl}').default,`;
    });
    inject();
    var viewsStr = app.reactRouters.map(router => {
      var page = router.component;
      return `${page} : require('./pages/${page}').default,`;
    }); 
    var appStr = fs.readFileSync(projectAppTsxPath).toString().replace('// controllers', controllersStr.join('\n'));
    appStr = appStr.replace('// views', viewsStr.join('\n'));
    fs.writeFileSync(projectAppTsxPath, appStr);
    shell.exec(`webpack ${watch ? '-w' : ''} ${production ? '-p' : ''}`);
  }
}

function launch(){
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
    process.exit(1);
  }
}
function bgLaunch(){
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    launchProcess = exec('ts-node --no-cache app.ts ', (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
    launchProcess.stdout.on('data', (data) => {
      if(data.indexOf('Listening') > -1){
        var port = /.+port (\d+)/.test(data) && RegExp.$1;
        resolve(port);
      }
      if(data) console.log(`${data}`);
    });
    
    launchProcess.stderr.on('data', (data) => {
      if(data) console.log(`${data}`);
    });
  });
}

function bgBuild(){
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    var buildProcess = exec(`ts-node ${path.resolve(__dirname, 'koa-cola.js')} build -w`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
    buildProcess.stdout.on('data', (data) => {
      if(/Time: (\d+)ms/.test(data)){
        resolve();
      }
      if(data) console.log(`${data}`);
    });
    
    buildProcess.stderr.on('data', (data) => {
      if(data) console.log(`${data}`);
    });
  });
}
var launchProcess;
// function exitHandler() {
//   if(launchProcess)
//     launchProcess.kill('SIGHUP');
// }

// //do something when app is closing
// process.on('exit', exitHandler);

// //catches ctrl+c event
// process.on('SIGINT', exitHandler);

// //catches uncaught exceptions
// process.on('uncaughtException', exitHandler);


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
    console.log(chalk.green('Installing packages. This might take a couple of minutes.'));
    shell.cd(`${projectPath}`);
    shell.exec('npm install');
    console.log(chalk.green('npm install done. '));
    // shell.exec('koa-cola');
  } else {
    templatePath = path.join(__dirname, '../', 'template');
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red('project exists : ' + projectPath));
      process.exit(1);
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
  build();
  launch();
} else if (program.dev) {
  bgLaunch().then(port => {
    bgBuild({watch : true}).then(() => {
      openBrowser('http://localhost:' + port);
    });
  });
  // 
}else if (program.schema) {
  createSchemaTypes();
} else if (program.build) {
  build();
} else {
  launch();
}
