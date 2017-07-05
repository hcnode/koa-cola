// 以下进行server端react router中间件
import * as React from 'react'
import * as Koa from 'koa';
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
var { ReduxAsyncConnect, loadOnServer, reducer } = require('redux-connect');
var createHistory = require('history').createMemoryHistory;
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import * as serialize from 'serialize-javascript';
import { req } from '../util/require';
import { shallow, mount, render } from 'enzyme';
import setDom from '../util/render-cola';
export default async (ctx, next) => {
	var routes = req(`${process.cwd()}/views/routers`);
	var layout = req(`${process.cwd()}/views/pages/layout`);
	if(!routes){
		console.log('${process.cwd()}/views/routers not found');
		return await next();
	}
	const store = createStore(combineReducers({ reduxAsyncConnect: reducer }));
	try {
		await new Promise((resolve, reject) => {
			match({ routes, location: ctx.url }, (err, redirect, renderProps) => {
				if (!renderProps) return reject();
				// load data
				loadOnServer({ ...renderProps, store, helpers:{ ctx } }).then(() => {
					var { location } = renderProps;
					/*if(location && location.query && location.query['event-cola']){
						try {
							var eventCola = JSON.parse(location.query['event-cola']);
							const { JSDOM } = require('jsdom');
							const jsdom = new JSDOM(``, {
								url: ctx.url.replace(/event-cola=.+(&|$)/gi, ''),
							});
							const { window } = jsdom;
							function copyProps(src, target) {
								const props = Object.getOwnPropertyNames(src)
									.filter(prop => typeof target[prop] === 'undefined')
									.forEach(prop => {
										Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(src, prop));
									});
							}

							global.window = window;
							global.document = window.document;
							global.navigator = {
								userAgent: 'node.js'
							};
							copyProps(window, global);
							// var wrapper = mount(page, { attachTo: document.getElementById('container') });
							window.onload = function(){
								if(eventCola.id && eventCola.event){
									ctx.session.eventColas = ctx.session.eventColas || {};
									var eventColas = ctx.session.eventColas[location.pathname] = ctx.session.eventColas[location.pathname] || [] 
									eventColas.push(eventCola);
									eventColas.forEach(cola => {
										// wrapper.find('#' + eventCola.id).simulate(cola.event)
										event = document.createEvent("HTMLEvents");
										event.initEvent(cola.event, true, true);
										document.getElementById(cola.id).dispatchEvent(event);
									});
								}
								// var html = document.getElementById('container').innerHTML
								ctx.body = document.getElementById('container').innerHTML;
								resolve();
							}
						} catch (error) {
							console.log(error)
						}
					}else{*/
						var appHTML = renderToString(<Provider store={store} key="provider">
							<ReduxAsyncConnect {...renderProps}  />
						</Provider>)
						if(layout){
							appHTML = layout(appHTML, store);
						}else{
							console.log(`${process.cwd()}/views/pages/layout nor found`)
						}
						// var prefix = app.config.prefix || '';
						// var staticPath = app.config.staticPath;
						// var publicPath = process.cwd() + '/public';
						var injectHtml = `
							<!-- its a Redux initial data -->
							<script>
								window.__data=${serialize(store.getState())};
							</script>
							</html>
						`;
						// <script src="${process.env.NODE_ENV == 'production' && staticPath ? staticPath : prefix}/bundle.js"></script>
						if(/<\/html\>/ig.test(appHTML)){
							appHTML = appHTML.replace(/<\/html\>/ig, injectHtml)
						}else{
							appHTML += injectHtml
						}
						ctx.body = appHTML;
						resolve();
					// }
				})
			})
		})
	} catch (error) {
		await next();
	}
};
