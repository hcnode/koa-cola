"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDir = require('require-dir');
function req(module) {
    var module = require(module);
    return module.default || module;
}
exports.req = req;
function reqDir(dir) {
    var libs = requireDir(dir);
    Object.keys(libs).forEach(key => {
        libs[key] = libs[key].default || libs[key];
    });
    return libs;
}
exports.reqDir = reqDir;
