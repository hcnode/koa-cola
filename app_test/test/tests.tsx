import * as should from 'should'
// require('should')
import * as Koa from 'Koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
// import mockgoose from 'mockgoose'
var mongoose = require('mongoose')
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
// var request = require("supertest-as-promised");
describe('', function() {
    var koaApp;
	before(function(done) {
        process.chdir('./app_test');
		koaApp = require('../src/index').default;
		mockgoose.prepareStorage().then(function() {
			mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function(err) {
				done(err);
			}); 
		});
		
	});
	describe('#koa', function() {
		it('#hello world', async function(){
			var res = await request(koaApp)
                .get("/")
                .expect(200)
                .toPromise();
			res.text.should.be.equal('hello world')		
		});
	});
});
