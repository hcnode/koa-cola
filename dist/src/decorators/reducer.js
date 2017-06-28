"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function Reducer(reducer) {
    return function (target) {
        target._reducer = reducer();
    };
}
exports.Reducer = Reducer;
;