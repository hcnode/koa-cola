import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import { chdir } from './util'
import App from '../src/index'
describe('#koa-cola middleware', function() {
    var server, mongoose;
	before(function(done) {
        chdir();
		server = App();
		mongoose = app.mongoose;
		var Mockgoose = require('mockgoose').Mockgoose;
		var mockgoose = new Mockgoose(mongoose);
		// mockgoose.prepareStorage().then(function() {
			app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function(err) {
				done(err);
			}); 
		// });
	});
	
	after(function(done){
		mongoose.disconnect(done)
		server.close();
	})

	describe('#middleware', function() {
		it('#requestTime', async function(){
			var res = await request(server)
                .get('/testMiddleware')
                .expect(200)
                .toPromise();
			should(res.text).match(/requestTime:\d*/);
		});

		it('#checkMiddlewareOrder', async function(){
			var res = await request(server)
                .get('/checkMiddlewareOrder')
                .expect(200)
                .toPromise();
			should(res.text).be.equal(['checkMiddlewareOrder', 'requestTime'].join('-'))
		});


		it('#disabledMiddleware', async function(){
			var res = await request(server)
                .get('/disabledMiddleware')
                .expect(404)
                .toPromise();
		});
	});
});
