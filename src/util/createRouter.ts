import * as fs from 'fs'
export default function(routers){
    createRouter(routers);
    createProvider(routers);
}
export function createRouter(routers){
    var code = `
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store  } = app.decorators.view;
    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
        ${routers.map(router => {
            return `<Route path="${router.path}" component={require('./pages/${router.component}').default}/>`
        }).join('\n    ')}
    </Router>
    `
    fs.writeFileSync(`${process.cwd()}/views/routers.tsx`, code);
    return code;
}

export function createProvider(routers){
    var code = `
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store  } = require("koa-cola").Decorators.view;
    import { createStore, combineReducers } from 'redux';
    import { render } from 'react-dom'
    import { Provider } from 'react-redux'
    export default () => {
        var reducers = Object.assign({}${routers.map(router => {
            return `, (app.pages['${router.component}']._reducer || {})`;
        }).join('')});
        
        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect : reducer}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            ${routers.map(router => {
            return `<Route path="${router.path}" component={app.pages['${router.component}']}/>`
            }).join('\n    ')}
        </Router>
        </Provider>
    }
    `
    fs.writeFileSync(`${process.cwd()}/views/provider.tsx`, code);
}