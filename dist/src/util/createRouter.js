"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function default_1(routers) {
    createRouter(routers);
    createProvider(routers);
}
exports.default = default_1;
function createRouter(routers) {
    var code = "\n    /**\n     * \u6B64router\u4EE3\u7801\u7531\u7A0B\u5E8F\u81EA\u52A8\u751F\u6210\n     */\n    import * as React from 'react';\n    import { IndexRoute, Router, Route, browserHistory } from 'react-router';\n    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = app.decorators.view;\n    export default <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>\n        " + routers.map(function (router) {
        return "<Route path=\"" + router.path + "\" component={require('./pages/" + router.component + "').default}/>";
    }).join('\n    ') + "\n    </Router>\n    ";
    fs.writeFileSync(process.cwd() + "/views/routers.tsx", code);
    return code;
}
exports.createRouter = createRouter;
function createProvider(routers) {
    var code = "\n    /**\n     * \u6B64router\u4EE3\u7801\u7531\u7A0B\u5E8F\u81EA\u52A8\u751F\u6210\n     */\n    import * as React from 'react';\n    import { IndexRoute, Router, Route, browserHistory } from 'react-router';\n    var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = require(\"koa-cola\").Decorators.view;\n    import { createStore, combineReducers } from 'redux';\n    import { render } from 'react-dom'\n    import { Provider } from 'react-redux'\n    export default () => {\n        var reducers = Object.assign({}" + routers.map(function (router) {
        return ", (require('./pages/" + router.component + "').default._reducer || {})";
    }).join('') + ");\n        \n        const store = createStore(combineReducers(Object.assign({ reduxAsyncConnect : reducer}, reducers)), (window as any).__data);\n        return <Provider store={store} key=\"provider\">\n        <Router render={(props) => <ReduxAsyncConnect {...props}/>} history={browserHistory}>\n            " + routers.map(function (router) {
        return "<Route path=\"" + router.path + "\" component={require('./pages/" + router.component + "').default}/>";
    }).join('\n    ') + "\n        </Router>\n        </Provider>\n    }\n    ";
    fs.writeFileSync(process.cwd() + "/views/provider.tsx", code);
}
exports.createProvider = createProvider;