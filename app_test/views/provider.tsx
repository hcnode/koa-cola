
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
        var reducers = Object.assign({}, (app.pages['simple']._reducer || {}), (app.pages['cola']._reducer || {}));
        
        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect : reducer}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            <Route path="/simple" component={app.pages['simple']}/>
    <Route path="/cola" component={app.pages['cola']}/>
        </Router>
        </Provider>
    }
    