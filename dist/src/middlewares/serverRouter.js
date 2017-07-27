"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 以下进行server端react router中间件
const React = require("react");
const server_1 = require("react-dom/server");
const react_router_1 = require("react-router");
var { ReduxAsyncConnect, loadOnServer, reducer } = require('redux-connect');
var createHistory = require('history').createMemoryHistory;
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const serialize = require("serialize-javascript");
const require_1 = require("../util/require");
exports.default = async (ctx, next) => {
    // app.routers.router 是react-router, 在 src/util/createRouter.tsx定义
    var routes = app.routers.router;
    var layout = require_1.req(`${process.cwd()}/views/pages/layout`);
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
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)));
    // const store = createStore(combineReducers({ reduxAsyncConnect: reducer }));
    try {
        await new Promise((resolve, reject) => {
            react_router_1.match({ routes, location: ctx.url }, (err, redirect, renderProps) => {
                if (!renderProps)
                    return reject();
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
                loadOnServer(Object.assign({}, renderProps, { store, helpers: { ctx } })).then(() => {
                    var { location } = renderProps;
                    var appHTML = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
                        React.createElement(ReduxAsyncConnect, Object.assign({}, renderProps))));
                    /**
                     * 必须配置layout，并且必须在layout引用bundle文件
                     * 浏览器端的react-redux所需要的文件由下面的injectHtml自动插入
                     */
                    if (layout) {
                        appHTML = layout(appHTML, store);
                    }
                    else {
                        console.log(`${process.cwd()}/views/pages/layout nor found`);
                    }
                    var injectHtml = `
                            <!-- its a Redux initial data -->
                            <script>
                                window.__data=${serialize(store.getState())};
                            </script>
                            </html>
                        `;
                    if (/<\/html\>/ig.test(appHTML)) {
                        appHTML = appHTML.replace(/<\/html\>/ig, injectHtml);
                    }
                    else {
                        appHTML += injectHtml;
                    }
                    ctx.body = appHTML;
                    resolve();
                });
            });
        });
    }
    catch (error) {
        await next();
    }
};
