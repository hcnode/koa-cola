
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
        <Route path="/simple" component={require('./pages/simple').default}/>
    <Route path="/cola" component={require('./pages/cola').default}/>
    </Router>
    