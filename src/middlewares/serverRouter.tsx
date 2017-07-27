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
export default async (ctx, next) => {
    // app.routers.router 是react-router, 在 src/util/createRouter.tsx定义
    var routes = app.routers.router;
    var layout = req(`${process.cwd()}/views/pages/layout`);
    if (!routes) {
        // 没有定义react-router的话next()
        console.log('${process.cwd()}/views/routers not found');
        return await next();
    }
    // router.component._reducer为react-redux的自定义reducer
    var reducers = app.reactRouters.map(router => {
        var component = app.pages[router.component];
        return component._reducer || {};
    });
    const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)));
    // const store = createStore(combineReducers({ reduxAsyncConnect: reducer }));
    try {
        await new Promise((resolve, reject) => {
            match({ routes, location: ctx.url }, (err, redirect, renderProps) => {
                if (!renderProps) return reject();
                /** load data, 并传入ctx到helpers，可以在async redux里面获取
                 * 参考app_test的cola.tsx :
                 * {
                        key: 'serverCallResult',
                        promise: async ({ params, helpers }) => {
                            var ctx = helpers.ctx;
                            var serverCallApi = new ServerCallApi({});
                            var data = await serverCallApi.fetch(ctx);
                            return data.result;
                        }
                    }
                 */
                /* var components = [];
                renderProps.components.forEach(element => {
                    components.push(element);
                });
                if(components[1] && components[1].childrenComponents){
                    components = components.concat(components[1].childrenComponents);
                }  */
                loadOnServer({ ...renderProps, store, helpers: { ctx } }).then(() => {
                    var { location } = renderProps;
                    var appHTML = renderToString(<Provider store={store} key="provider">
                        <ReduxAsyncConnect {...renderProps} />
                    </Provider>)
                    /**
                     * 必须配置layout，并且必须在layout引用bundle文件
                     * 浏览器端的react-redux所需要的文件由下面的injectHtml自动插入
                     */
                    if (layout) {
                        appHTML = layout(appHTML, store);
                    } else {
                        console.log(`${process.cwd()}/views/pages/layout nor found`)
                    }
                    var injectHtml = `
                            <!-- its a Redux initial data -->
                            <script>
                                window.__data=${serialize(store.getState())};
                            </script>
                            </html>
                        `;
                    if (/<\/html\>/ig.test(appHTML)) {
                        appHTML = appHTML.replace(/<\/html\>/ig, injectHtml)
                    } else {
                        appHTML += injectHtml
                    }
                    ctx.body = appHTML;
                    resolve();
                })
            })
        })
    } catch (error) {
        await next();
    }
};
