import * as fs from 'fs'

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
            return <Route path={router.path} component={app.pages[router.component]}/>
        })}
    </Router>

    var reducers = routers.map(router => {
        return app.pages[router.component]._reducer || {};
    });

    if(typeof window != 'undefined'){
        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect: reducer }, ...reducers)), (window as any).__data);
        app.routers.provider = app.routers.provider || <Provider store={store} key="provider">
            <Router render={(props) => <ReduxAsyncConnect {...props} />} history={browserHistory}>
                {routers.map(router => {
                    return <Route path={router.path} component={app.pages[router.component]}/>
                })}
            </Router>
        </Provider>
    }
}
