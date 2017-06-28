"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

var _require = require('jsdom'),
    JSDOM = _require.JSDOM;

function setDom(html) {
    var jsdom = new JSDOM(html);
    var window = jsdom.window;

    function copyProps(src, target) {
        var props = Object.getOwnPropertyNames(src).filter(function (prop) {
            return typeof target[prop] === 'undefined';
        }).forEach(function (prop) {
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(src, prop));
        });
    }
    global.window = window;
    global.document = window.document;
    global.navigator = {
        userAgent: 'node.js'
    };
    copyProps(window, global);
    return jsdom;
}
exports.default = setDom;