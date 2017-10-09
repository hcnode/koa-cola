"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDir = require('require-dir');
var { getEnvironment } = require('./env');
var dirCache = {};
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
        var env = getEnvironment();
        if (dirCache[dir]) {
            if (env == 'production') {
                return dirCache[dir].map;
            }
            else {
                Object.keys(dirCache[dir].modulePathMap).forEach(item => {
                    delete require.cache[dirCache[dir].modulePathMap[item]];
                });
            }
        }
        var { map, modulePathMap } = requireDir(dir);
        if (map)
            dirCache[dir] = { map, modulePathMap };
        return map;
    }
};
function req(module) {
    try {
        var env = getEnvironment();
        if (env != 'production') {
            delete require.cache[module];
        }
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
        if (err.code == 'ENOENT') {
            console.log(`dir ${dir} does not exist`);
        }
        else {
            console.error(require('util').inspect(err));
        }
        return {};
    }
}
exports.reqDir = reqDir;
//# sourceMappingURL=require.js.map