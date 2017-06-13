import * as should from 'should'
// require('should')
import * as Koa from 'Koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
// import mockgoose from 'mockgoose'
var mongoose = require('mongoose')
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
// var request = require("supertest-as-promised");
describe('', function() {
    var app;
	before(function(done) {
        process.chdir('./app_test');
		app = require('../src/index').default;
		// require('mockgoose')(mongoose).then(function() {
			mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function(err) {
				done(err);
			}); 
		// });
	});
	describe('#koa', function() {
		it('#hello world', async function(){
			var res = await request(app)
                .get("/")
                .expect(200)
                .toPromise();
			res.text.should.be.equal('hello world')		
		});
	});

	describe('#controller-decorators', function() {
		it('#injectCtxAndResponse201', async function(){
			var res = await request(app)
                .get("/injectCtx")
                .expect(201)
                .toPromise();
			res.text.should.be.equal('injectCtx')		
		});
		it('#postBody', async function(){
			var body = { name: 'Manny', species: 'cat' };
			var res = await request(app)
                .post("/postBody")
				.send(body)
                .expect(200)
                .toPromise();
			res.text.should.be.equal(JSON.stringify(body));
		});
		it('#get postBody error', async function(){
			var res = await request(app)
                .get("/postBody")
                .expect(405)
		});
		it('#getQuery', async function(){
			var body = { name: 'Manny', species: 'cat' };
			var res = await request(app)
                .get('/getQuery?' + Object.keys(body).map(item => `${item}=${body[item]}`).join('&'))
                .expect(200)
                .toPromise();
			res.text.should.be.equal(JSON.stringify(body));
		});
	});

	describe('#controller-view', function() {
		it('#normal view', async function(){
			var foo = require(`${process.cwd()}/views/pages/page1`).foo;
			var res = await request(app)
                .get('/getView')
                .expect(200)
                .toPromise();
			should(res.text).containEql(foo);
		});
		it('#view with async redux', async function(){
			// foo is sync, bar is async
			var { foo, bar, timeout } = require(`${process.cwd()}/views/pages/page2`);
			var startTimeout : any = new Date();
			var res = await request(app)
                .get('/getView2')
                .expect(200)
                .toPromise();
			var endTimeout : any = new Date();
			should(endTimeout - startTimeout).greaterThan(timeout)
			should(res.text).containEql(foo);
			should(res.text).containEql(bar);
		});
	});

	describe('#router&provider', function() {
		it('#router', async function(){
			var router = require(`${process.cwd()}/views/routers`).default;
			router.should.be.ok;
			router.props.children.length.should.be.equal(2);
			router.props.children[0].type.displayName.should.be.equal('Route');
			router.props.children[0].type.should.be.equal(Route);
			router.props.children[0].props.path.should.be.ok;
			router.props.children[0].props.component.should.be.ok;
		});

		it('#provider', async function(){
			// TODO
		});
	});

	describe('#middleware', function() {
		it('#requestTime', async function(){
			var res = await request(app)
                .get('/testMiddleware')
                .expect(200)
                .toPromise();
			should(res.text).match(/requestTime:\d*/);
		});

		it('#checkMiddlewareOrder', async function(){
			var res = await request(app)
                .get('/checkMiddlewareOrder')
                .expect(200)
                .toPromise();
			should(res.text).be.equal(['checkMiddlewareOrder', 'requestTime'].join('-'))
		});


		it('#disabledMiddleware', async function(){
			var res = await request(app)
                .get('/disabledMiddleware')
                .expect(404)
                .toPromise();
		});
	});

	describe('#models', function() {
		
		it('#base', async function(){
			var User = global.app.models.User
			var result = await User.create({name : 'harry', email : 'hcnode@gmail.com'});
			result._id.should.be.ok;
		});

		it('#Manual validate', async function(){
			var User = global.app.models.User
			var exceptionHappened = false;
			try{
				var result = await User.create({name : 'harry'});
			}catch(e){
				e.message.should.equal('400');
				exceptionHappened = true;
			}
			exceptionHappened.should.be.ok;
		});
		it('#query', async function(){
			var User = global.app.models.User
			var [result] = await User.find({name : 'harry'}).exec();
			result.name.should.be.equal('harry');
		});

		it('#aggregate', async function(){
			var User = global.app.models.User
			await User.create({name : 'harry', email : 'xxx@gmail.com'});
			var [result] = await User.aggregate([
				{
					$project: { name: 1, email: 1 }
				},
				{
					$group : {
						_id : '$name',
						count: { $sum: 1 }
					}
				}
			]);
			result.count.should.be.ok;
		});
	});


	describe('#response', function() {
		it('#ok', async function(){
			var res = await request(app)
                .get('/getOkResponse')
                .expect(200)
                .toPromise();
			var json = JSON.parse(res.text);
			json.code.should.be.equal(200);
			json.result.should.be.ok;
		});
	});

	describe('#response error', function() {
		it('#404', async function(){
			var res = await request(app)
                .get('/404')
				.set('Accept', 'text/html')
                .expect(404)
                .toPromise();
			console.log(res.text)
		});
	});
});
