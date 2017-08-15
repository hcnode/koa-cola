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
