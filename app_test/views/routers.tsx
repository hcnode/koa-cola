
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
        <Route path="/getView" component={require('./pages/page1').default}/>
    <Route path="/getView2" component={require('./pages/page2').default}/>
    </Router>
    