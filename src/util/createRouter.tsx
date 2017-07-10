import * as React from 'react';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';

import { createStore, combineReducers } from 'redux';
import { render } from 'react-dom'
import { Provider } from 'react-redux'


export default function createRouter(routers) {
    var { ReduxAsyncConnect, asyncConnect, reducer } = app.decorators.view;
    app.routers = app.routers || {};
    app.routers.router = app.routers.router || <Router render={(props) => <ReduxAsyncConnect {...props} />} history={browserHistory}>
        {routers.map(router => {
            return <Route path={router.path} component={app.pages[router.component]} />
        })}
    </Router>
}

export function createProvider(controllers, views) {
    var reactRouters = [];
    const ROUTE_PREFIX = '$routes'
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
    const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)), (window as any).__data);
    return function(){
        return <Provider store={store} key="provider">
            <Router render={(props) => <ReduxAsyncConnect {...props} />} history={browserHistory}>
                {
                    reactRouters.map(router => {
                        var component = router.component;
                        return <Route path={router.path} component={component} />
                    })
                }
            </Router>
        </Provider>
    }
}
