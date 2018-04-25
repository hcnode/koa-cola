/**
 * 创建react路由
 * node端创建Router对象
 * 浏览器端则创建provider对象
 */
import * as React from "react";
import BrowserRouter from "react-router-dom/BrowserRouter";
import renderRoutes from "react-router-config/renderRoutes";

import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { asyncConnect } from "redux-connect";

/**
 * 创建node端react路由并保存在全局app.routers.router
 * @param routers
 */
export default function createRouter(routers, pages?) {
  var reactRouters = [];
  for (const { component, path } of routers) {
    if (component) {
      if (typeof component == "string") {
        var viewComponent;
        try {
          if(app && app.pages && app.pages[component]){
            viewComponent = app.pages[component];
          }else if(pages){
            viewComponent = pages[component];
          }else{
            viewComponent = require(`${process.cwd()}/view/pages/${component}`).default;
          }
        } catch (error) {}
        if (viewComponent) {
          reactRouters.push({
            component: viewComponent,
            path
          });
        } else {
          console.log(`view ${component} not found`);
        }
      } else {
        reactRouters.push({
          component: component,
          path
        });
      }
    }
  }
  app.routers = app.routers || {};
  app.routers.router = reactRouters
    .map(router => {
      let component = router.component;
      if (!component) {
        return null;
      }
      if (component.name != "Connect") {
        component = asyncConnect([])(component);
      }
      return {
        path: router.path,
        component,
        ...(component.childrenComponents
          ? {
              components: component.childrenComponents
            }
          : {})
      };
    })
    .filter(router => router);
  return app.routers.router;
  //app.decorators.view defined in util.decorators.ts
  // app.routers = app.routers || {};
  // app.routers.router = (
  //   <Router render={props => <ReduxAsyncConnect {...props} />} history={browserHistory}>
  //     {routers.map(router => {
  //       let component = app.pages[router.component];
  //       if (!component) {
  //         return console.log(`component ${router.component} not found`);
  //       }
  //       if (process.env.NODE_ENV != "production") {
  //         // var path = require('path').resolve(process.cwd(), 'views', 'pages', router.component);
  //         // if(require('fs').existsSync(path)){
  //         // delete require.cache[require.resolve(path)];
  //         // component = require(require.resolve(path)).default;
  //         // }
  //       }
  //       if (component.name != "Connect") {
  //         component = asyncConnect([{ key: "ctrl", promise: () => null }])(component);
  //       }
  //       if (component.childrenComponents) {
  //         return (
  //           <Route path={router.path} component={component}>
  //             <IndexRoute components={component.childrenComponents} />
  //           </Route>
  //         );
  //       } else {
  //         return <Route path={router.path} component={component} />;
  //       }
  //     })}
  //   </Router>
  // );
}
/**
 * 参考 app_test/views/app.tsx :
 * 
 * var Provider = createProvider([
        require('../api/controllers/IndexController').default
    ],{
        cola : require('./pages/cola').default,
        simple : require('./pages/simple').default,
    });

    render(<Provider />, document.getElementById('app'))

 * @param controllers controller数组
 * @param views react page页面数组
 */
/* istanbul ignore next */
export function createProvider(routers, views?, reduxMiddlewares?) {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  var { ReduxAsyncConnect, reducer } = require("../../../client");

  var routes = createRouter(routers, views);
  var reducers = routes.reduce((_reducer, router) => {
    if (router.component._reducer) {
      _reducer = { ..._reducer, ...router.component._reducer };
    }
    if (router.component.childrenComponents) {
      Object.keys(router.component.childrenComponents).forEach(child => {
        if (router.component.childrenComponents[child]._reducer) {
          _reducer = { ..._reducer, ...router.component.childrenComponents[child]._reducer };
        }
      });
    }
    return _reducer;
  }, {});
  // 合并reducer，并使用页面的__data作为初始化数据
  var enhancer = composeEnhancers(
    applyMiddleware.apply(null, Object.keys(reduxMiddlewares || {}).map(item => reduxMiddlewares[item]))
  );
  const store = createStore(
    combineReducers({ reduxAsyncConnect: reducer, ...reducers }),
    (window as any).__data,
    enhancer
  );
  return function() {
    return (
      <Provider store={store} key="provider">
        <BrowserRouter>
          <ReduxAsyncConnect routes={routes} />
        </BrowserRouter>
      </Provider>
    );
  };
}
