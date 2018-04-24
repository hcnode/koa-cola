require("should");
import * as should from "should";
import * as Koa from "koa";
import * as request from "supertest-as-promised";
import * as React from "react";
import * as fs from "fs";
import { chdir, resetdir, initBrowser, initDb } from './util';
import { exec } from 'child_process';
// import * as shell from 'shelljs'
var shell = require("shelljs");
var path = require("path");
var App = require("../dist").RunApp;

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("#koa-cola cli", function() {
  var server;
  before(function() {
    chdir();
  });
  after(function(done) {
    process.chdir(`${path.resolve(__dirname, "../")}`);
    delete global.app;
    resetdir();
    done();
  });

  async function watch(){
    var pagePath = path.resolve(
      __dirname,
      "../app_test/app/views/pages/index.tsx"
    );
    var str = fs.readFileSync(pagePath).toString();
    fs.writeFileSync(
      pagePath,
      str.replace("check bundle if work", "check bundle whether work")
    );
    await timeout(3000);
    var res = await request(server)
      .get("/")
      .expect(200)
      .toPromise();
    fs.writeFileSync(
      pagePath,
      str.replace("check bundle whether work", "check bundle if work")
    );
    return res;
  }
  describe("#cli", function() {
    it("#new project", function(done) {
      shell.exec(`node ${path.resolve("../", "bin", "koa-cola")} new app`);
      fs.existsSync(path.resolve("./", "app")).should.be.equal(true);
      fs
        .existsSync(path.resolve("./", "app", "node_modules"))
        .should.be.equal(true);
      done();
    });
    it("#run build and check bundle file size", function(done) {
      process.chdir("./app");
      shell.cd(`${path.resolve(__dirname,"../app_test/app")}`);
      shell.exec(
        `webpack -p`
      );
      var stat = fs.statSync(path.join(process.cwd(), "public", "bundle.js"));
      stat.size.should.be.lessThan(500 * 1024);
      done();
    });
    it("#launch project", async function() {
      server = App();
      var res = await request(server)
        .get("/")
        .expect(200)
        .toPromise();
      res.text.should.be.containEql("Wow koa-cola!");
    });
    it("#watch not work", async function() {
      var res = await watch();
      res.text.should.be.containEql("check bundle if work");
    });

    // it("#bundle work ok", async function() {
    //   if (require("os").platform() != "win32") {
    //     const { JSDOM } = require("jsdom");
    //     const virtualConsole = new (require("jsdom")).VirtualConsole();
    //     var dom = await JSDOM.fromURL(`http://127.0.0.1:${app.config.port}/`, {
    //       virtualConsole: virtualConsole.sendTo(console),
    //       runScripts: "dangerously",
    //       features: {
    //         FetchExternalResources: ["script"],
    //         ProcessExternalResources: ["script"]
    //       },
    //       resources: "usable"
    //     });
    //     const { window } = dom;
    //     const document = window.document;
    //     return new Promise((resolve, reject) => {
    //       window.onload = () => {
    //         setTimeout(() => {
    //           document.getElementsByTagName("BUTTON")[0].click();
    //           should(document.getElementsByTagName("H1")[0].innerHTML).be.equal(
    //             "Wow koa-cola and bundle work!"
    //           );
    //           resolve();
    //         }, 1000);
    //       };
    //     });
    //   }
    // });
    // it('#cli dev', async function(){
    //   server.close();
    //   // process.chdir("./app");
    //   // shell.exec(
    //   //   `ts-node ${path.resolve("../../", "bin", "koa-cola")} dev`
    //   // );
    //   var launchProcess = exec(`ts-node ${path.resolve("../../", "bin", "koa-cola")} dev`, (error) => {
    //     if (error) {
    //       console.error(`exec error: ${error}`);
    //       return;
    //     }
    //   });
    //   await new Promise((resolve, reject) => {
    //     launchProcess.stdout.on('data', (data : string) => {
    //       if(data) console.log(data);
    //       if(data.indexOf('Listening') > -1){
    //         resolve();
    //       }
    //     });
    //   });
    //   var res = await watch();
    //   res.text.should.be.containEql("check bundle whether work");
    //   launchProcess.kill();
    // })
    it("#new project with api mode", function(done) {
      server.close();
      process.chdir("../");
      shell.exec("rm -rf app");
      shell.exec(
        `node ${path.resolve("../", "bin", "koa-cola")} new app -m api`
      );
      fs.existsSync(path.resolve("./", "app", "app.tsx")).should.be.equal(true);
      fs
        .existsSync(path.resolve("./", "app", "node_modules"))
        .should.be.equal(true);
      shell.exec("rm -rf app");
      done();
    });
  });
});
