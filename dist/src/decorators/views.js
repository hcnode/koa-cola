"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ColaReducer(reducers) {
    return function (target) {
        target._reducer = reducers;
    };
}
exports.ColaReducer = ColaReducer;
function ChildrenComponents(components) {
    return function (target) {
        target.childrenComponents = components;
    };
}
exports.ChildrenComponents = ChildrenComponents;
function header(header) {
    return function (target) {
        target.Header = header;
    };
}
exports.header = header;
function bundle(bundle) {
    return function (target) {
        target._bundle = bundle;
    };
}
exports.bundle = bundle;
function doNotUseLayout(target) {
    target._doNotUseLayout = true;
}
exports.doNotUseLayout = doNotUseLayout;
var { asyncConnect } = require('redux-connect');
function Cola() {
    var args = Array.from(arguments);
    return function (target) {
        var map = args.shift() || {};
        var reducer = args.pop();
        var component = asyncConnect(Object.keys(map).map(item => {
            return {
                key: item,
                promise: map[item]
            };
        }), ...args)(target);
        component._reducer = reducer;
        return component;
    };
}
exports.Cola = Cola;
