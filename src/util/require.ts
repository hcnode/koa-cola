var requireDir = require('require-dir');
var _reqDir = (dir) => {
    if(require.context){
        var context = require.context(dir, false, /\.(j|t)s(x)?$/);
        var obj = {};
        context.keys().forEach(function (key) {
            obj[key] = context(key);
        });
        return obj;
    }else{
        return requireDir(dir);
    }
}
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
        const libs = _reqDir(dir);
        return Object.keys(libs).reduce((host: {}, key: string) => {
            host[key] = libs[key].default || libs[key];
            return host;
        }, {});
    
    } catch (err) {
        if(err.code == 'ENOENT'){
            console.log(`dir ${dir} does not exist`)
        }else{
            console.error(require('util').inspect(err))
        }
        return {};
    }
}