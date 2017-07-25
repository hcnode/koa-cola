import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('../').Decorators.controller;
import { chdir } from './util'
import App from '../src/index'
@Controller('')
class FooController {
	@Get('/')
	index() {
		return app.config.foo
	}
	@Get('/pepsiMiddelware')
	pepsiMiddelware( @Ctx() ctx) {
		return ctx.state.bar;
	}
	@Get('/routerUse')
	@Use(async function setUser(ctx: Koa.Context, next) {
		ctx.state.routerUse = 'some state'
		await next();
	})
	routerUse( @Ctx() ctx) {
		return ctx.state.routerUse;
	}

	@Get('/view')
	@View('pepsiView')
	view( @Ctx() ctx) { }
}

class PepsiView extends React.Component<{
	foo: string
}, {}>   {
	constructor(props: {foo: string}) {
		super(props);
	}
	static defaultProps = {
		foo: 'fooooo'
	};
	render() {
		return <div>
			<div><h2>koa-cola</h2></div>
			<div>foo:{this.props.foo}</div>
		</div>
	}
};
describe('#koa-cola pepsi mode', function () {
	var server, mongoose;
	before(function (done) {
		// chdir();
		server = App({
			mode: 'pepsi',
			config: {
				foo: 'hello pepsi',
				middlewares: {
					pepsi: true
				}
			},
			controllers: {
				FooController: FooController
			},
			middlewares: {
				pepsi: function pepsi() {
					return async function (ctx, next) {
						ctx.state.bar = 'barrrrr';
						await next();
					}
				}
			},
			pages: {
				pepsiView: PepsiView
			}
			/*models : {
				...
			}*/
		});
		mongoose = app.mongoose;
		var Mockgoose = require('mockgoose').Mockgoose;
		var mockgoose = new Mockgoose(mongoose);
		mockgoose.prepareStorage().then(function() {
		app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function (err) {
			done(err);
		});
		});
	});

	after(function (done) {
		server.close();
		delete global.app;
		mongoose.disconnect(done)
	})

	describe('#cola mode', function () {
		it('#inject config and router', async function () {
			var res = await request(server)
				.get("/")
				.expect(200)
				.toPromise();
			res.text.should.be.equal('hello pepsi')
		});
		it('#inject middlewares', async function () {
			var res = await request(server)
				.get("/pepsiMiddelware")
				.expect(200)
				.toPromise();
			res.text.should.be.equal('barrrrr')
		});
		it('# router Use decorators', async function () {
			var res = await request(server)
				.get("/routerUse")
				.expect(200)
				.toPromise();
			res.text.should.be.equal('some state')
		});
		it('# view router && inject views', async function () {
			var res = await request(server)
				.get("/view")
				.expect(200)
				.toPromise();
			res.text.should.be.containEql('fooooo');
		});
	});
});
