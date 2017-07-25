export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
try{
    var { run } = require('./src/app');
}catch(e){}
export const RunApp = run;
try{
    var injectGlobal = require('./src/util/injectGlobal');
    exports.injectGlobal = injectGlobal;
}catch(e){}

export { createProvider } from './src/util/createRouter';

const controllerDecorators = require("controller-decorators");
const reduxConnect = require("redux-connect");
/* try {
    var mongooseDecorators = require('mongoose-decorators');
}
catch (e) { } */
exports.Decorators = {
    controller: controllerDecorators,
    // model: mongooseDecorators,
    view: Object.assign(reduxConnect, { store: require('redux-connect/lib/store') })
};