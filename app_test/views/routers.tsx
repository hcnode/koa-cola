
    /**
     * 此router代码由程序自动生成
     */
    import * as React from 'react';
    import { IndexRoute, Router, Route, browserHistory } from 'react-router';
    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = app.decorators.view;
    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>
        <Route path="/simple" component={require('./pages/simple').default}/>
    <Route path="/cola" component={require('./pages/cola').default}/>
    </Router>
    