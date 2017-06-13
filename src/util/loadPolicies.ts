var requireDir = require('require-dir')
export default function loadPolicies() : any{
    var policies = requireDir(`${process.cwd()}/api/policies`);
    Object.keys(policies).forEach(key => {
         policies[key] = policies[key.substring(0, 1).toUpperCase() + key.substr(1)] = policies[key].default || policies[key];
    })
    return {
        policies
    }
}