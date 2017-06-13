export function req(module){
    var module = require(module);
    return module.default || module;
}