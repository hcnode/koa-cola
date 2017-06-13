
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
        var reducers = Object.assign({}, (require('./pages/page1').getReducer || function(){return {}})(), (require('./pages/page2').getReducer || function(){return {}})());
        
        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect}, reducers)), (window as any).__data);
        return <Provider store={store} key="provider">
        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
            <Route path="/getView" component={require('./pages/page1').default}/>
    <Route path="/getView2" component={require('./pages/page2').default}/>
        </Router>
        </Provider>
    }
    