// 以下进行server端react router中间件
import * as React from 'react'
import * as Koa from 'koa';
import { renderToString } from 'react-dom/server'
import { match, RoutingContext } from 'react-router'
var { ReduxAsyncConnect, loadOnServer, reducer } = require('redux-connect');
import createHistory from 'history/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import * as serialize from 'serialize-javascript';
import { req } from '../util/require';
var routes = req(`${process.cwd()}/views/routers`);
var layout = req(`${process.cwd()}/views/pages/layout`);
export default async (ctx, next) => {
	const store = createStore(combineReducers({ reduxAsyncConnect: reducer }));
	try {
		await new Promise((resolve, reject) => {
			match({ routes, location: ctx.url }, (err, redirect, renderProps) => {
				if (!renderProps) return reject();
				// load data
				loadOnServer({ ...renderProps, store }).then(() => {
					const appHTML = renderToString(
						<Provider store={store} key="provider">
							<ReduxAsyncConnect {...renderProps} />
						</Provider>
					)
					const html = layout(appHTML, store)
					ctx.body = html;
					resolve();
				})
			})
		})
	} catch (error) {
		await next();
	}
};
