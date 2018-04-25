"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建react路由
 * node端创建Router对象
 * 浏览器端则创建provider对象
 */
const React = require("react");
const BrowserRouter_1 = require("react-router-dom/BrowserRouter");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
const redux_connect_1 = require("redux-connect");
/**
 * 创建node端react路由并保存在全局app.routers.router
 * @param routers
 */
function createRouter(routers, pages) {
    var reactRouters = [];
    for (const { component, path } of routers) {
        if (component) {
            if (typeof component == "string") {
                var viewComponent;
                try {
                    if (app && app.pages && app.pages[component]) {
                        viewComponent = app.pages[component];
                    }
                    else if (pages) {
                        viewComponent = pages[component];
                    }
                    else {
                        viewComponent = require(`${process.cwd()}/view/pages/${component}`).default;
                    }
                }
                catch (error) { }
                if (viewComponent) {
                    reactRouters.push({
                        component: viewComponent,
                        path
                    });
                }
                else {
                    console.log(`view ${component} not found`);
                }
            }
            else {
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
            component = redux_connect_1.asyncConnect([])(component);
        }
        return Object.assign({ path: router.path, component }, (component.childrenComponents
            ? {
                components: component.childrenComponents
            }
            : {}));
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
exports.default = createRouter;
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
function createProvider(routers, views, reduxMiddlewares) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
    var { ReduxAsyncConnect, reducer } = require("../../../client");
    var routes = createRouter(routers, views);
    var reducers = routes.reduce((_reducer, router) => {
        if (router.component._reducer) {
            _reducer = Object.assign({}, _reducer, router.component._reducer);
        }
        if (router.component.childrenComponents) {
            Object.keys(router.component.childrenComponents).forEach(child => {
                if (router.component.childrenComponents[child]._reducer) {
                    _reducer = Object.assign({}, _reducer, router.component.childrenComponents[child]._reducer);
                }
            });
        }
        return _reducer;
    }, {});
    // 合并reducer，并使用页面的__data作为初始化数据
    var enhancer = composeEnhancers(redux_1.applyMiddleware.apply(null, Object.keys(reduxMiddlewares || {}).map(item => reduxMiddlewares[item])));
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reduxAsyncConnect: reducer }, reducers)), window.__data, enhancer);
    return function () {
        return (React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
            React.createElement(BrowserRouter_1.default, null,
                React.createElement(ReduxAsyncConnect, { routes: routes }))));
    };
}
exports.createProvider = createProvider;
//# sourceMappingURL=createRouter.js.map