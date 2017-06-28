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
						const appHTML = renderToString(<Provider store={store} key="provider">
							<ReduxAsyncConnect {...renderProps}  />
						</Provider>)
						var html = layout(appHTML, store);
						var injectHtml = `
							<!-- its a Redux initial data -->
							<script>
								window.__data=${serialize(store.getState())};
							</script>
							<script src="/bundle.js"></script>
							</html>
						`;
						if(/<\/html\>/ig.test(html)){
							html = html.replace(/<\/html\>/ig, injectHtml)
						}else{
							html += injectHtml
						}
						ctx.body = html;
						resolve();
					// }
				})
			})
		})
	} catch (error) {
		await next();
	}
};
