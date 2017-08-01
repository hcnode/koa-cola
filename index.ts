/**
 * 以下injectGlobal，RunApp，reqInject为node端使用
 */
try {
  var { run } = require('./src/app');
  var injectGlobal = require('./src/util/injectGlobal').default;
  exports.injectGlobal = injectGlobal;
  exports.RunApp = run;
  exports.reqInject = function(cb) {
    if (!global.app) injectGlobal();
    cb();
  };
} catch (e) {}

/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
export { createProvider } from './src/util/createRouter';
/* try {
    var mongooseDecorators = require('mongoose-decorators');
}
catch (e) { } */
exports.Decorators = {
  controller: controllerDecorators,
  // model: mongooseDecorators,
  view : {...reduxConnect, store: require('redux-connect/lib/store')}
};
