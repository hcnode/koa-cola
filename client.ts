/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps } = require('./src/decorators/views');
const { createProvider } = require('./src/util/createRouter');

export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
module.exports = {
  // ApiBase,
  // apiFetch,
  createProvider,
  ...reduxConnect,
  ...controllerDecorators,
  ...exports,
  store: require('redux-connect/lib/store'),
  colaReducer: ColaReducer,
  include: ChildrenComponents,
  header,
  bundle,
  doNotUseLayout,
  Cola, pageProps
};