
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = require("/Users/harry/develop/koa-cola/src/util/../../node_modules/redux-connect");
    import { createStore, combineReducers } from 'redux';
    import { render } from 'react-dom'
    import { Provider } from 'react-redux'
    export default () => {
        var reducers = Object.assign({}, (require('./pages/simple').default._reducer || {}), (require('./pages/cola').default._reducer || {}));
        
        const store = createStore(combineReducers(Object.assign({ reducer}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            <Route path="/simple" component={require('./pages/simple').default}/>
    <Route path="/cola" component={require('./pages/cola').default}/>
        </Router>
        </Provider>
    }
    