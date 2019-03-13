#!/usr/bin/env ts-node
// require("ts-node/register");
var program = require('commander');
var path = require('path');
var fs = require('fs-extra');
var shell = require('shelljs');
var chalk = require('chalk');
var { reqDir } = require('../dist/src/util/require');
var inject = require('../dist').injectGlobal;
var createSchemaTypes = require('../dist/src/util/createSchemaTypes').default;
const openBrowser = require('react-dev-utils/openBrowser');
var os = require('os').platform();
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
  var appTsx = path.join(__dirname, 'app.tsx.tmp');
  var projectAppTsxPath = path.join(process.cwd(), 'views', 'app.tsx');
  if(!fs.existsSync(path.join(process.cwd(), 'views'))){
    console.log(chalk.red(path.join(process.cwd(), 'views') + ' not found'));
    process.exit(1);
  }else{
    shell.cp(appTsx, projectAppTsxPath);
    var configs = reqDir(path.join(process.cwd(), 'config'));
    var reduxMiddleware = Object.keys(configs).find(key => configs[key].reduxMiddlewares);
    var reduxMiddlewareStr = reduxMiddleware ? `, require('../config/${reduxMiddleware}').reduxMiddlewares` : '';
    inject();
    var routers = app.reactRouters.map(({component, path}) => ({
      component, path
    }));
    
    var viewsStr = routers.map(router => {
      var page = router.component;
      return `'${page}' : require('./pages/${page}').default,`;
    }); 
    var appStr = fs.readFileSync(projectAppTsxPath).toString()
      .replace('// routers', JSON.stringify(routers.map(router => {
        return {...router, page : `require('./pages/${router.component}').default`}
      }), null, '\t').replace(/\"require/gi, "require").replace(/default\"/gi, "default"))
      .replace('// redux-middleware', reduxMiddlewareStr)
      // .replace('// views', viewsStr.join('\n'));
    fs.writeFileSync(projectAppTsxPath, appStr);
    console.log(`webpack ${watch ? '-w' : ''} ${production ? '-p' : ''}`);
    shell.exec(`webpack ${watch ? '-w' : ''} ${production ? '-p' : ''}`);
    if(!watch) shell.exit();
  }
}

function launch(){
  if (fs.existsSync(`${process.cwd()}/app.js`)) {
    shell.exec(
      `node ${process.cwd()}/app.js`
    );
  } else {
    console.log(chalk.red(`${process.cwd()}/app.js not found`));
    process.exit(1);
  }
}
function bgLaunch(noCache){
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    launchProcess = exec(`${noCache ? (os == 'win32' ? 'set KOA_COLA_CACHE=no&&' : 'KOA_COLA_CACHE=no ') : ''} node app.js `, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
    });
    launchProcess.stdout.on('data', (data) => {
      if(data) console.log(`${data}`);
      if(data.indexOf('Listening') > -1){
        var port = /.+port (\d+)/.test(data) && RegExp.$1;
        resolve(port);
      }
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
      if(data) console.log(`${data}`);
      if(/Time: (\d+)ms/.test(data)){
        resolve();
      }
    });
    
    buildProcess.stderr.on('data', (data) => {
      if(data) console.log(`${data}`);
    });
  });
}
var launchProcess;

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
    console.log(chalk.green(`Project ${name} created with api mode.`));
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
      console.log(chalk.green(`Project ${name} created with normal mode.`));
      console.log(chalk.green('Installing packages. This might take a couple of minutes.'));
      shell.cd(`${projectPath}`);
      shell.exec('npm install');
      console.log(chalk.green('npm install done. '));
      // console.log(chalk.green('now webpack building project... please wait a moment.'));
      // shell.exec('npm run open');
    }
  }
} else if (program.dev) {
  bgBuild({watch : true}).then(() => {
    bgLaunch(true).then(port => {
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
