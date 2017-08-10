/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout } = require('./dist/src/decorators/views');
const { Base, fetch } = require('./dist/src/util/api');
const { createProvider } = require('./dist/src/util/createRouter');
exports.ApiBase = Base;
exports.apiFetch = fetch;
exports.createProvider = createProvider;
exports.Decorators = {
  controller: controllerDecorators,
  view: Object.assign(reduxConnect, {
    store: require('redux-connect/lib/store'),
    colaReducer: ColaReducer,
    include: ChildrenComponents,
    header,
    bundle,
    doNotUseLayout
  })
};
