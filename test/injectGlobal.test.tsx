import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { shallow, mount, render } from 'enzyme';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import inject from '../src/util/injectGlobal';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('../').Decorators.controller;
import { chdir, initBrowser } from './util';
describe('#koa-cola inject global', function () {
	var server, mongoose;
	before(function (done) {
		chdir();
		inject();	
		initBrowser();
		mongoose = app.mongoose;
		var Mockgoose = require('mockgoose').Mockgoose;
		var mockgoose = new Mockgoose(mongoose);
		// mockgoose.prepareStorage().then(function() {
			app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function(err) {
				done(err);
			}); 
		// });
	});
	
	after(function (done) {
		delete global.app;
		mongoose.disconnect(done);
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
