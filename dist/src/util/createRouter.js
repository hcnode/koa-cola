"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_router_1 = require("react-router");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
function createRouter(routers) {
    var { ReduxAsyncConnect, asyncConnect, reducer } = app.decorators.view;
    app.routers = app.routers || {};
    app.routers.router = app.routers.router || React.createElement(react_router_1.Router, { render: (props) => React.createElement(ReduxAsyncConnect, Object.assign({}, props)), history: react_router_1.browserHistory }, routers.map(router => {
        return React.createElement(react_router_1.Route, { path: router.path, component: app.pages[router.component] });
    }));
}
exports.default = createRouter;
function createProvider(controllers, views) {
    var reactRouters = [];
    const ROUTE_PREFIX = '$routes';
    for (const ctrl of controllers) {
        var routes = Reflect.getMetadata(ROUTE_PREFIX, ctrl);
        if (routes) {
            ctrl[ROUTE_PREFIX] = routes;
        }
        else {
            routes = ctrl[ROUTE_PREFIX];
        }
        for (const { method, url, middleware, name, params, view, response } of routes) {
            if (view) {
                reactRouters.push({
                    component: views && views[view] ? views[view] : view, path: url
                });
            }
        }
    }
    var { ReduxAsyncConnect, asyncConnect, reducer } = require("../../").Decorators.view;
    var reducers = reactRouters.map(router => {
        // return app.pages[router.component]._reducer || {};
        return router.component._reducer || {};
    });
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)), window.__data);
    return function () {
        return React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
            React.createElement(react_router_1.Router, { render: (props) => React.createElement(ReduxAsyncConnect, Object.assign({}, props)), history: react_router_1.browserHistory }, reactRouters.map(router => {
                var component = router.component;
                return React.createElement(react_router_1.Route, { path: router.path, component: component });
            })));
    };
}
exports.createProvider = createProvider;
