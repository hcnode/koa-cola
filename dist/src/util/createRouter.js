"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function default_1(routers) {
    createRouter(routers);
    createProvider(routers);
}
exports.default = default_1;
function createRouter(routers) {
    var code = `
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = app.decorators.view;
    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
        ${routers.map(router => {
        return `<Route path="${router.path}" component={require('./pages/${router.component}').default}/>`;
    }).join('\n    ')}
    </Router>
    `;
    fs.writeFileSync(`${process.cwd()}/views/routers.tsx`, code);
    return code;
}
exports.createRouter = createRouter;
function createProvider(routers) {
    var code = `
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = require("${__dirname}/../../node_modules/redux-connect");
    import { createStore, combineReducers } from 'redux';
    import { render } from 'react-dom'
    import { Provider } from 'react-redux'
    export default () => {
        var reducers = Object.assign({}${routers.map(router => {
        return `, (require('./pages/${router.component}').default._reducer || {})`;
    }).join('')});
        
        const store = createStore(combineReducers(Object.assign({ reducer}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            ${routers.map(router => {
        return `<Route path="${router.path}" component={require('./pages/${router.component}').default}/>`;
    }).join('\n    ')}
        </Router>
        </Provider>
    }
    `;
    fs.writeFileSync(`${process.cwd()}/views/provider.tsx`, code);
}
exports.createProvider = createProvider;
