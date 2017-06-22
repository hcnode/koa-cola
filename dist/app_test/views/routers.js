"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 此router代码由程序自动生成
 */
const React = require("react");
const react_router_1 = require("react-router");
var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer } = app.decorators.view;
exports.default = React.createElement(react_router_1.Router, { render: (props) => React.createElement(ReduxAsyncConnect, Object.assign({}, props)), history: react_router_1.browserHistory },
    React.createElement(react_router_1.Route, { path: "/simple", component: require('./pages/simple').default }),
    React.createElement(react_router_1.Route, { path: "/cola", component: require('./pages/cola').default }));
