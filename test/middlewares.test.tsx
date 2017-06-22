import * as should from 'should'
import * as Koa from 'Koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import { chdir } from './util'
describe('#koa-cola middleware', function() {
    var koaApp : Koa, mongoose;
	before(function(done) {
        chdir();
		koaApp = require('../src/index').default;
		mongoose = app.mongoose;
		var Mockgoose = require('mockgoose').Mockgoose;
		var mockgoose = new Mockgoose(mongoose);
		mockgoose.prepareStorage().then(function() {
			app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function(err) {
				done(err);
			}); 
		});
	});
	
	after(function(done){
		mongoose.disconnect(done)
	})

	describe('#middleware', function() {
		it('#requestTime', async function(){
			var res = await request(koaApp)
                .get('/testMiddleware')
                .expect(200)
                .toPromise();
			should(res.text).match(/requestTime:\d*/);
		});

		it('#checkMiddlewareOrder', async function(){
			var res = await request(koaApp)
                .get('/checkMiddlewareOrder')
                .expect(200)
                .toPromise();
			should(res.text).be.equal(['checkMiddlewareOrder', 'requestTime'].join('-'))
		});


		it('#disabledMiddleware', async function(){
			var res = await request(koaApp)
                .get('/disabledMiddleware')
                .expect(404)
                .toPromise();
		});
	});
});
