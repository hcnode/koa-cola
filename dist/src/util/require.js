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
        const libs = requireDir(dir);
        return Object.keys(libs).reduce((host, key) => {
            host[key] = libs[key].default || libs[key];
            return host;
        }, {});
    }
    catch (err) {
        console.log(`dir ${dir} does not exist`);
        return {};
    }
}
exports.reqDir = reqDir;
