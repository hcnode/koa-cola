"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requireDir = require("require-dir");
var { getEnvironment } = require("./env");
const path = require("path");
var dirCache = {};
var _reqDir = (dir, recurse) => {
    // if(require.context){
    //     var context = require.context(dir, false, /\.(j|t)s(x)?$/);
    //     var obj = {};
    //     context.keys().forEach(function (key) {
    //         obj[key] = context(key);
    //     });
    //     return obj;
    // }else{
    var env = getEnvironment();
    if (dirCache[dir]) {
        if (env == "production") {
            return dirCache[dir].map;
        }
        else {
            Object.keys(dirCache[dir].modulePathMap).forEach(item => {
                delete require.cache[dirCache[dir].modulePathMap[item]];
            });
        }
    }
    var { map, modulePathMap } = requireDir(dir, { recurse });
    if (map)
        dirCache[dir] = { map, modulePathMap };
    return flattenMap(map);
    // }
};
function flattenMap(map) {
    var entries = Object.entries(map);
    return entries.reduce((newMap, [key, value]) => {
        if (value.map && value.modulePathMap) {
            var subMap = flattenMap(value.map);
            var keys = Object.keys(subMap);
            newMap = Object.assign(Object.assign({}, newMap), keys.reduce((newSubMap, subKey) => {
                newSubMap[[key, subKey].join('/')] = subMap[subKey];
                return newSubMap;
            }, {}));
        }
        return newMap;
    }, map);
}
function req(module) {
    try {
        var env = getEnvironment();
        if (env != "production") {
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
function reqDir(dir, recurse = true) {
    try {
        dir = path.resolve(dir);
        const libs = _reqDir(dir, recurse);
        return Object.keys(libs).reduce((host, key) => {
            host[key] = libs[key].default || libs[key];
            return host;
        }, {});
    }
    catch (err) {
        if (err.code == "ENOENT") {
            console.log(`dir ${dir} does not exist`);
        }
        else {
            console.error(require("util").inspect(err));
        }
        return {};
    }
}
exports.reqDir = reqDir;
//# sourceMappingURL=require.js.map