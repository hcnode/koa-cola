"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 此router代码由程序自动生成
 */
const React = require("react");
const react_router_1 = require("react-router");
var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer } = require("/Users/harry/develop/koa-cola/src/util/../../node_modules/redux-connect");
const redux_1 = require("redux");
const react_redux_1 = require("react-redux");
exports.default = () => {
    var reducers = Object.assign({}, (require('./pages/simple').default._reducer || {}), (require('./pages/cola').default._reducer || {}));
    const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reducer }, reducers)), window.__data);
    return React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
        React.createElement(react_router_1.Router, { render: (props) => React.createElement(ReduxAsyncConnect, Object.assign({}, props)), history: react_router_1.browserHistory },
            React.createElement(react_router_1.Route, { path: "/simple", component: require('./pages/simple').default }),
            React.createElement(react_router_1.Route, { path: "/cola", component: require('./pages/cola').default })));
};
