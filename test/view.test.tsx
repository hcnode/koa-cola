require("should");
import * as should from "should";
import * as Koa from "koa";
import * as request from "supertest-as-promised";
import * as React from "react";
import { shallow, mount, render } from "enzyme";
import { IndexRoute, Router, Route, browserHistory } from "react-router";
var inject = require("../dist").injectGlobal;
import { chdir, resetdir, initBrowser, loadScript, initDb } from "./util";
import * as webpack from "webpack";
import * as fs from "fs";
var App = require("../dist").RunApp;
describe("#koa-cola view", function() {
  var server, mongoose;
  before(function() {
    chdir();
    initBrowser();
    server = App();
    return initDb();
  });

  after(function(done) {
    delete global.app;
    resetdir();
    done();
  });
  describe("#", function() {
    it("button", function() {
      var click = false;

      var CustomButton = require(`${process.cwd()}/views/components/button`)
        .default;
      var wrapper = mount(
        <CustomButton
          text="xxx"
          onClick={() => {
            click = true;
          }}
        />,
        { attachTo: document.getElementById("app") }
      );

      wrapper.find("div button").node.innerHTML.should.be.equal("xxx");
      wrapper.find("div button").length.should.be.equal(1);
      wrapper.find("#isMounted").node.innerHTML.should.be.equal("true");
      wrapper.find("#isMounted2").node.innerHTML.should.be.equal("cola!");
      wrapper.find("div button").simulate("click");
      should(click).be.equal(true);
      wrapper.detach();
    });
    it("#build bundle", function(done) {
      console.log(
        `testing webpack building bundle.js, please wait around 30's`
      );
      var config = require(`${process.cwd()}/webpack.config`);
      webpack(config, (err, stats) => {
        if (err || stats.hasErrors()) {
          throw err;
        }
        done();
      });
    });
    // it("#load view and test client side react component", async function() {
    //   const { JSDOM } = require("jsdom");
    //   const virtualConsole = new (require("jsdom")).VirtualConsole();
    //   var dom = await JSDOM.fromURL(
    //     `http://127.0.0.1:${app.config.port}/cola`,
    //     {
    //       virtualConsole: virtualConsole.sendTo(console),
    //       runScripts: "dangerously",
    //       features: {
    //         FetchExternalResources: ["script"],
    //         ProcessExternalResources: ["script"]
    //       },
    //       resources: "usable"
    //     }
    //   );
    //   const { window } = dom;
    //   const document = window.document;
    //   var pepsi2 = require(`${process.cwd()}/views/pages/cola`).pepsi2;
    //   return new Promise((resolve, reject) => {
    //     window.onload = () => {
    //       setTimeout(() => {
    //         document
    //           .getElementById("dataFromServer")
    //           .innerHTML.should.be.equal("hello");
    //         document.getElementById("btn2").click();
    //         should(document.getElementById("pepsi").innerHTML).be.equal(pepsi2);
    //         document.getElementById("btn3").click();
    //         should(document.getElementById("cola").innerHTML).be.equal("wow");
    //         should(
    //           document.getElementById("reduxMiddlewareData").innerHTML
    //         ).be.equal("");
    //         document.getElementById("btn5").click();
    //         setTimeout(() => {
    //           should(
    //             document.getElementById("reduxMiddlewareData").innerHTML
    //           ).be.equal("this is from reduxMiddleware");
    //           resolve();
    //         }, 1500);
    //       }, 1000);
    //     };
    //   });
    // });
  });
});
