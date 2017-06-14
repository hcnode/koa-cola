var requireDir = require('require-dir');
export function req(module){
    var module = require(module);
    return module.default || module;
}


export function reqDir(dir){
    var libs = requireDir(dir);
    Object.keys(libs).forEach(key => {
        libs[key] = libs[key].default || libs[key];
    });
    return libs;
}