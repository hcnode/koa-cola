"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 以下进行server端react router中间件
const React = require("react");
const server_1 = require("react-dom/server");
const redux_connect_1 = require("redux-connect");
var loadSuccess = require("redux-connect/lib/store").loadSuccess;
var createHistory = require("history").createMemoryHistory;
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const require_1 = require("../util/require");
const createRouter_1 = require("../util/createRouter");
const layoutWrapper_1 = require("./layoutWrapper");
const StaticRouter_1 = require("react-router/StaticRouter");
const url_1 = require("url");
const react_router_config_1 = require("react-router-config");
exports.default = async (ctx, next) => {
    // app.routers.router 是react-router, 在 src/util/createRouter.tsx定义
    if (process.env.NODE_ENV != "production") {
        createRouter_1.default(app.reactRouters);
    }
    var routes = app.routers.router;
    var layout = require_1.req(`${process.cwd()}/views/pages/layout`);
    /* istanbul ignore if */
    if (!routes) {
        // 没有定义react-router的话next()
        console.log("${process.cwd()}/views/routers not found");
        return await next();
    }
    // router.component._reducer为react-redux的自定义reducer
    var reducers = app.reactRouters.map(router => {
        var component = app.pages[router.component];
        return (component && component._reducer) || {};
    });
    var middleware = redux_1.applyMiddleware.apply(null, Object.keys(app.config.reduxMiddlewares || {}).map(item => app.config.reduxMiddlewares[item]));
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reduxAsyncConnect: redux_connect_1.reducer }, ...reducers)), middleware);
    const url = ctx.originalUrl || ctx.request.url;
    const location = url_1.parse(url);
    const branch = react_router_config_1.matchRoutes(routes, url);
    var component = branch && branch[0] && branch[0].route.component;
    await redux_connect_1.loadOnServer({ store, location, routes, helpers: { ctx } });
    // try {
    //   var reactRouter = app.reactRouters.find(
    //     item => item.path == ctx.path
    //   );
    //   if (reactRouter) {
    //     var { func, args } = reactRouter;
    //     if (renderProps.components[1]) {
    //       renderProps.components[1].reduxAsyncConnect =
    //         renderProps.components[1].reduxAsyncConnect || [];
    //       var ctrlItem = renderProps.components[1].reduxAsyncConnect.find(
    //         item => item.key == "ctrl"
    //       );
    //       if (ctrlItem) {
    //         var result = await func(...args(ctx, next));
    //         store.dispatch(loadSuccess("ctrl", result));
    //       }
    //     }
    //   }
    // } catch (error) {
    //   /* istanbul ignore next */
    //   console.error(error);
    // }
    var appHTML;
    try {
        const context = {};
        // 2. use `ReduxAsyncConnect` to render component tree
        appHTML = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
            React.createElement(StaticRouter_1.default, { location: location, context: context },
                React.createElement(redux_connect_1.ReduxAsyncConnect, { routes: routes, helpers: { ctx } }))));
        // handle redirects
        if (context.url) {
            ctx.set("Location", context.url);
            return (ctx.status = 302);
        }
        // 3. render the Redux initial data into the server markup
    }
    catch (error) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV != "production") {
            ctx.body = require("util").inspect(error);
            /* istanbul ignore else */
        }
        else {
            ctx.body = "unexpected error.";
        }
    }
    appHTML = await layoutWrapper_1.default(appHTML, component, layout, store, ctx);
    ctx.body = appHTML;
    // try {
    //   await new Promise((resolve, reject) => {
    //     match(
    //       { routes, location: ctx.url },
    //       async (err, redirect, renderProps) => {
    //         if (!renderProps) return reject();
    //         loadOnServer({
    //           ...renderProps,
    //           store,
    //           helpers: { ctx }
    //         }).then(async () => {
    //           try {
    //             var reactRouter = app.reactRouters.find(
    //               item => item.path == ctx.path
    //             );
    //             if (reactRouter) {
    //               var { func, args } = reactRouter;
    //               if (renderProps.components[1]) {
    //                 renderProps.components[1].reduxAsyncConnect =
    //                   renderProps.components[1].reduxAsyncConnect || [];
    //                 var ctrlItem = renderProps.components[1].reduxAsyncConnect.find(
    //                   item => item.key == "ctrl"
    //                 );
    //                 if (ctrlItem) {
    //                   var result = await func(...args(ctx, next));
    //                   store.dispatch(loadSuccess("ctrl", result));
    //                 }
    //               }
    //             }
    //           } catch (error) {
    //             /* istanbul ignore next */
    //             console.error(error);
    //           }
    //           var { location } = renderProps;
    //           try {
    //             var appHTML = renderToString(
    //               <Provider store={store} key="provider">
    //                 <ReduxAsyncConnect {...renderProps} />
    //               </Provider>
    //             );
    //           } catch (error) {
    //             /* istanbul ignore if */
    //             if (process.env.NODE_ENV != "production") {
    //               ctx.body = require("util").inspect(error);
    //               /* istanbul ignore else */
    //             } else {
    //               ctx.body = "unexpected error.";
    //             }
    //             return resolve();
    //           }
    //           appHTML = await layoutWrapper(
    //             appHTML,
    //             renderProps.components[1],
    //             layout,
    //             store,
    //             renderProps,
    //             ctx
    //           );
    //           ctx.body = appHTML;
    //           resolve();
    //         });
    //       }
    //     );
    //   });
    // } catch (error) {
    //   await next();
    // }
};
//# sourceMappingURL=serverRouter.js.map