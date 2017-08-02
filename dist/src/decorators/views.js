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
