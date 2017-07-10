"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDir = require('require-dir');
function req(module) {
    try {
        var module = require(module);
        return module.default || module;
    }
    catch (err) {
        return null;
    }
}
exports.req = req;
function reqDir(dir) {
    try {
        var libs = requireDir(dir);
        Object.keys(libs).forEach(key => {
            libs[key] = libs[key].default || libs[key];
        });
        return libs;
    }
    catch (err) {
        console.log(err);
        return {};
    }
}
exports.reqDir = reqDir;
