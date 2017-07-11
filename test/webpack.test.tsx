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
		// mockgoose.prepareStorage().then(function () {
		app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function (err) {
			done(err);
		});
		// });
	});

	after(function (done) {
		delete global.app;
		done();
	})
	describe('#', function () {
		it('#build bundle', function (done) {
			var config = require(`${process.cwd()}/webpack.config`);
			webpack(config, (err, stats) => {
				if (err || stats.hasErrors()) {
					throw (new Error('webpack build error'))
				}
				done();
			});
		});
		it('#load view and test client side react component', async function (done) {

			const { JSDOM } = require('jsdom');
			const virtualConsole = new (require('jsdom').VirtualConsole)();
			var dom = await JSDOM.fromURL(`http://127.0.0.1:${app.config.port}/cola`, {
				virtualConsole: virtualConsole.sendTo(console),
				runScripts: "dangerously",
				features: {
					FetchExternalResources: ["script"],
					ProcessExternalResources: ["script"]
				},
				resources: "usable",
			})
			const { window } = dom;
			const document = window.document;
			var pepsi2 = require(`${process.cwd()}/views/pages/cola`).pepsi2;
			window.onload = () => {
				setTimeout(() => {
					document.getElementById('dataFromServer').innerHTML.should.be.equal('hello')
					document.getElementById('btn2').click();
					should(document.getElementById('pepsi').innerHTML).be.equal(pepsi2);
					document.getElementById('btn3').click();
					should(document.getElementById('cola').innerHTML).be.equal('wow');
					done();
				}, 1000);
			}
		});
	});
});
