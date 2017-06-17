
    /**
     * 此router代码由程序自动生成
     */
    import 'reflect-metadata';
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
    import { createStore, combineReducers } from 'redux';
    import { render } from 'react-dom'
    import { Provider } from 'react-redux'
    export default () => {
        var reducers = Object.assign({}, (require('./pages/simple').getReducer || function(){return {}})(), (require('./pages/cola').getReducer || function(){return {}})());
        
        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            <Route path="/simple" component={require('./pages/simple').default}/>
    <Route path="/cola" component={require('./pages/cola').default}/>
        </Router>
        </Provider>
    }
    