"use strict";
/* export function ColaReducer(reducers) {
  return function(target) {
    target._reducer = reducers;
  };
} */
Object.defineProperty(exports, "__esModule", { value: true });
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
function pageProps(pageProps) {
    return function (target) {
        target._pagePros = pageProps;
    };
}
exports.pageProps = pageProps;
function doNotUseLayout(target) {
    target._doNotUseLayout = true;
}
exports.doNotUseLayout = doNotUseLayout;
var { asyncConnect } = require('redux-connect');
function Cola({ initData = {}, mapStateToProps = null, mapDispatchToProps = null, reducer = null }) {
    return function (target) {
        var component = asyncConnect(Object.keys(initData).map(item => {
            return {
                key: item,
                promise: initData[item]
            };
        }), mapStateToProps, mapDispatchToProps)(target);
        if (reducer) {
            component._reducer = reducer;
        }
        return component;
    };
}
exports.Cola = Cola;
//# sourceMappingURL=views.js.map