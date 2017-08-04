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
        const libs = requireDir(dir);
        return Object.keys(libs).reduce((host: {}, key: string) => {
            host[key] = libs[key].default || libs[key];
            return host;
        }, {});
    
    } catch (err) {
        console.log(`dir ${dir} does not exist`)
        return {};
    }
}