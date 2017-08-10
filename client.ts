/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout } = require('./src/decorators/views');
export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
const { createProvider } = require('./src/util/createRouter');
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
