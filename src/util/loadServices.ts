var requireDir = require('require-dir')
export default function loadPolicies() : any{
    var services = requireDir(`${process.cwd()}/api/services`);
    Object.keys(services).forEach(key => {
         services[key] = services[key.substring(0, 1).toUpperCase() + key.substr(1)] = services[key].default || services[key];
    })
    return { services }
}