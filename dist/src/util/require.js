"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDir = require('require-dir');
var _reqDir = (dir) => {
    if (require.context) {
        var context = require.context(dir, false, /\.(j|t)s(x)?$/);
        var obj = {};
        context.keys().forEach(function (key) {
            obj[key] = context(key);
        });
        return obj;
    }
    else {
        return requireDir(dir);
    }
};
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
        const libs = _reqDir(dir);
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
