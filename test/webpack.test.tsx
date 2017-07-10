import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { shallow, mount, render } from 'enzyme';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import inject from '../src/util/injectGlobal';
import { chdir, initBrowser, loadScript } from './util';
import * as webpack from "webpack";
import * as fs from 'fs';
import App from '../src/index'
describe('#koa-cola webpack', function () {
	var server, mongoose;
	before(function (done) {
		chdir();
		// initBrowser();
		server = App();
		mongoose = app.mongoose;
		var Mockgoose = require('mockgoose').Mockgoose;
		var mockgoose = new Mockgoose(mongoose);
		mockgoose.prepareStorage().then(function () {
			app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function (err) {
				done(err);
			});
		});
	});

	after(function (done) {
		delete global.app;
		done();
	})
	describe('#', function () {
		/*it('#build bundle', function (done) {
			var config = require(`${process.cwd()}/webpack.config`);
			webpack(config, (err, stats) => {
				if (err || stats.hasErrors()) {
					throw (new Error('webpack build error'))
				}
				// Done processing
				done();
			});
		});*/
		it('#load bundle', async function (done) {
			// var res = await request(server)
			//     .get("/")
			//     .expect(200)
			//     .toPromise();

			const { JSDOM } = require('jsdom');
			const virtualConsole = new (require('jsdom').VirtualConsole)();
			virtualConsole.sendTo(console);
			var dom = await JSDOM.fromURL(`http://127.0.0.1:${app.config.port}/cola`, {
				virtualConsole : virtualConsole.sendTo(console),
				runScripts: "dangerously",
				features: {
					FetchExternalResources : ["script"],
					ProcessExternalResources: ["script"]
				},
				resources: "usable",
				/*resourceLoader: function (resource, callback) {
					if (resource.url.href.startsWith("/bundle.js")) {
						callback(null, fs.readFileSync(`${process.cwd()}/public/bundle.js`, "utf-8"))
					} else {
						resource.defaultFetch(callback)
					}
				}*/
			})
			const { window } = dom;
			const document = window.document;
			window.onload = () => {
				document.getElementById('btn2').click();
				console.log(document.getElementById('pepsi').innerHTML);
			}
		});
	});
});
