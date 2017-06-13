var requireDir = require('require-dir')
export default function loadModels() : any{
    var models = requireDir(`${process.cwd()}/api/models`);
    Object.keys(models).forEach(key => {
         models[key] = models[key.substring(0, 1).toUpperCase() + key.substr(1)] = models[key].default || models[key];
    })
    return {
        models
    }
}