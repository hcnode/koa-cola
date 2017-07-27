var requireDir = require('require-dir');
export function req(module){
    try {
        var module = require(module);
        return module.default || module;
    } catch (err) {
        return null;
    }
}


export function reqDir(dir){
    try {
        var libs = requireDir(dir);
        Object.keys(libs).forEach(key => {
            libs[key] = libs[key].default || libs[key];
        });
        return libs;
    } catch (err) {
        console.log(`dir ${dir} does not exist`)
        return {};
    }
}