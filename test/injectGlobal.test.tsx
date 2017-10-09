require('should')
import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { shallow, mount, render } from 'enzyme';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
var reqInject = require('../dist').reqInject;
import { chdir, resetdir, initBrowser, initDb } from './util';
describe('#koa-cola inject global', function () {
	var server, mongoose;
	before(function () {
		// chdir();
		return new Promise((resolve, reject) => {
			reqInject('./app_test', () => {
				initBrowser();
				chdir();
				resolve();
			});
		}).then(() => {
			return initDb();
		});
	});
	
	after(function (done) {
		app.mongoose.disconnect(done)
		delete global.app;
		resetdir();
	})
	describe('#', function () {
		it('#get inject manager', async function () {
			var TestManager = app.managers.TestManager;
			new TestManager().hi().should.be.equal('hi');
		});

		it('#require manager', async function () {
			var TestManager = require(`${process.cwd()}/api/managers/TestManager`).default;
			new TestManager().hi().should.be.equal('hi');
		});


		it('#create user by inject model and manager', async function () {
			var TestManager = app.managers.TestManager;
			var testManager = new TestManager();
			var result = await testManager.createUser();
			var user = await testManager.findHarry();
			result.name.should.be.equal('Harry');
			user.name.should.be.equal('Harry');
		});

		it('#inject view', async function () {
			var SimplePage = app.pages.simple;
			var wrapper = mount(<SimplePage  />, { attachTo: document.getElementById('app') });
			wrapper.find('#foo').node.should.be.ok;
		});
	});
});
