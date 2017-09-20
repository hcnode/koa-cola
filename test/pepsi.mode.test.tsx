require('should')
import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('../client');
import { chdir, initDb } from './util';
var App = require('../dist/src').default
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
	view( @Ctx() ctx) { 
		
	} 

	@Get('/simpleView')
	@View('simpleView')
	simpleView( @Ctx() ctx) { 
		return {
			foo_from_ctrl : 'bar from ctrl'
		}
	} 
}
interface Props  {
	foo: string, ctrl : any
}
class PepsiView extends React.Component<Props, {}>   {
	constructor(props: Props) {
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
	before(function () {
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
				pepsiView: PepsiView,
				simpleView : function({ctrl : {foo_from_ctrl}}){
					return <div>{foo_from_ctrl}</div>
				}
			}
			/*models : {
				...
			}*/
		});
		return initDb();
	});

	after(function (done) {
		server.close();
		app.mongoose.disconnect(done)
		delete global.app;
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

		it('# view router && inject views && use props return from controller', async function () {
			var res = await request(server)
				.get("/simpleView")
				.expect(200)
				.toPromise();
			res.text.should.be.containEql('bar from ctrl');
		});
	});
});
