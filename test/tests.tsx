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

	describe('#controller-decorators', function() {
		it('#injectCtxAndResponse201', async function(){
			var res = await request(koaApp)
                .get("/injectCtx")
                .expect(201)
                .toPromise();
			res.text.should.be.equal('injectCtx')		
		});
		it('#postBody', async function(){
			var body = { name: 'Manny', species: 'cat' };
			var res = await request(koaApp)
                .post("/postBody")
				.send(body)
                .expect(200)
                .toPromise();
			res.text.should.be.equal(JSON.stringify(body));
		});
		it('#get postBody error', async function(){
			var res = await request(koaApp)
                .get("/postBody")
                .expect(405)
		});
		it('#getQuery', async function(){
			var body = { name: 'Manny', species: 'cat' };
			var res = await request(koaApp)
                .get('/getQuery?' + Object.keys(body).map(item => `${item}=${body[item]}`).join('&'))
                .expect(200)
                .toPromise();
			res.text.should.be.equal(JSON.stringify(body));
		});
	});

	describe('#controller-view', function() {
		it('#normal view', async function(){
			var foo = require(`${process.cwd()}/views/pages/page1`).foo;
			var res = await request(koaApp)
                .get('/getView')
                .expect(200)
                .toPromise();
			should(res.text).containEql(foo);
		});
		it('#view with async redux', async function(){
			// foo is sync, bar is async
			var { foo, bar, timeout } = require(`${process.cwd()}/views/pages/page2`);
			var startTimeout : any = new Date();
			var res = await request(koaApp)
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

	describe('#models', function() {
		
		it('#base', async function(){
			var User = global.app.models.user
			var result = await User.create({name : 'harry', email : 'hcnode@gmail.com'});
			result._id.should.be.ok;
		});

		it('#Manual validate', async function(){
			var User = global.app.models.user
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
			var User = global.app.models.user
			var [result] = await User.find({name : 'harry'}).exec();
			result.name.should.be.equal('harry');
		});

		// it('#aggregate', async function(){
		// 	var User = global.app.models.user
		// 	await User.create({name : 'harry', email : 'xxx@gmail.com'});
		// 	var [result] = await User.aggregate([
		// 		{
		// 			$project: { name: 1, email: 1 }
		// 		},
		// 		{
		// 			$group : {
		// 				_id : '$name',
		// 				count: { $sum: 1 }
		// 			}
		// 		}
		// 	]);
		// 	result.count.should.be.ok;
		// });
	});


	describe('#response', function() {
		it('#ok', async function(){
			var res = await request(koaApp)
                .get('/getOkResponse')
                .expect(200)
                .toPromise();
			var json = JSON.parse(res.text);
			json.code.should.be.equal(200);
			json.result.should.be.ok;
		});
	});

	describe('#response error', function() {
		it('#404 render from tsx', async function(){
			var res = await request(koaApp)
                .get('/404')
				.set('Accept', 'text/html')
                .expect(404)
                .toPromise();
			should(res.text).match(/rendered from 404.tsx/);
		});
		it('#500', async function(){
			var res = await request(koaApp)
                .get('/500')
				.set('Accept', 'text/html')
                .expect(500)
                .toPromise();
			should(res.text).match(/Internal Server Error/);
		});
	});

	describe('#policies', function() {
		it('#not login and throw 401', async function(){
			var res = await request(koaApp)
                .get('/notLogin')
                .expect(401)
                .toPromise();
			res.text.should.be.equal('Unauthorized');
		})

		it('#login', async function(){
			var res = await request(koaApp)
                .get('/isLogin')
                .expect(200)
                .toPromise();
			res.text.should.be.equal('logined.');
		})
	});

	describe('#policies', function() {
		it('#not login and throw 401', async function(){
			var res = await request(koaApp)
                .get('/notLogin')
                .expect(401)
                .toPromise();
			res.text.should.be.equal('Unauthorized');
		})

		it('#login', async function(){
			var res = await request(koaApp)
                .get('/isLogin')
                .expect(200)
                .toPromise();
			res.text.should.be.equal('logined.');
		})
	});

	describe('#env and config', function() {
		it('#test config override default', async function(){
			app.config.env.should.be.equal('test');
		});
	});
	describe('#services and managers', function() {
		it('#say hi', async function(){
			new app.managers.TestManager().hi().should.be.equal('hi');
		});
	});
	describe('#test session', function() {
		it('#session.count', async function(){
			const agent = request.agent(koaApp);
			var res = await agent
                .get('/session')
                .expect(200)
                .toPromise();
			var count1 = parseInt(res.text, 10);
			count1.should.be.equal(1)
			res = await agent
                .get('/session')
                .expect(200)
                .toPromise();
			var count2 = parseInt(res.text, 10);
			count2.should.be.equal(2)
		});
	});

});
