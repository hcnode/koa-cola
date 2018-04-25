// 以下进行server端react router中间件
import * as React from "react";
import * as Koa from "koa";
import { renderToString } from "react-dom/server";
import { ReduxAsyncConnect, loadOnServer, reducer } from "redux-connect-new";
var loadSuccess = require("redux-connect-new/lib/store").loadSuccess;
var createHistory = require("history").createMemoryHistory;
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import * as serialize from "serialize-javascript";
import { req } from "../util/require";
import createRouter from "../util/createRouter";
import layoutWrapper from "./layoutWrapper";
import StaticRouter from "react-router/StaticRouter";
import { parse as parseUrl } from "url";
import { matchRoutes } from 'react-router-config'
export default async (ctx: Koa.Context, next) => {
  // app.routers.router 是react-router, 在 src/util/createRouter.tsx定义
  if (process.env.NODE_ENV != "production") {
    createRouter(app.reactRouters);
  }
  var routes = app.routers.router;
  var layout = req(`${process.cwd()}/views/pages/layout`);
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
  var middleware = applyMiddleware.apply(
    null,
    Object.keys(app.config.reduxMiddlewares || {}).map(item => app.config.reduxMiddlewares[item])
  );
  const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)), middleware);
  const url = ctx.path;
  const location = parseUrl(url);
  const branch = matchRoutes(routes, url)
  var component = branch && branch[0] && branch[0].route.component;
  if(!component){
    return await next();
  }
  await loadOnServer({ store, location, routes, helpers: { ctx } });
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
    const context: any = {};
    // 2. use `ReduxAsyncConnect` to render component tree
    appHTML = renderToString(
      <Provider store={store} key="provider">
        <StaticRouter location={location} context={context}>
          <ReduxAsyncConnect routes={routes} helpers={{ ctx }} />
        </StaticRouter>
      </Provider>
    );

    // handle redirects
    if (context.url) {
      ctx.set("Location", context.url);
      return (ctx.status = 302);
    }

    // 3. render the Redux initial data into the server markup
  } catch (error) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV != "production") {
      ctx.body = require("util").inspect(error);
      /* istanbul ignore else */
    } else {
      ctx.body = "unexpected error.";
    }
  }
  appHTML = await layoutWrapper(
    appHTML,
    component, 
    layout,
    store,
    ctx
  );
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
