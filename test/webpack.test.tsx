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
describe('#koa-cola webpack', function () {
	var server, mongoose;
	before(function (done) {
		chdir();
		inject();
		initBrowser();
		done();
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
					throw(new Error('webpack build error'))
				}
				// Done processing
				done();
			});
		});
		it('#load bundle', async function () {
			var script = fs.readFileSync(`${process.cwd()}/public/bundle.js`);
			loadScript('window.xxx=111');
			console.log((window as any).xxx)
		});*/
	});
});
