require('should')
import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import { chdir, initDb } from './util';
var App = require('../dist').RunApp
describe('#koa-cola middleware', function() {
    var server, mongoose;
	before(function() {
        chdir();
		server = App();
		return initDb();
	});
	
	after(function(done){
		app.mongoose.disconnect(done)
		delete global.app;
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
