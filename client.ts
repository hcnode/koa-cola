/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps } = require('./src/decorators/views');
import { Base as ApiBase, fetch as apiFetch } from './src/util/api';
const { createProvider } = require('./src/util/createRouter');
module.exports = {
  ApiBase,
  apiFetch,
  createProvider,
  ...controllerDecorators,
  store: require('redux-connect/lib/store'),
  colaReducer: ColaReducer,
  include: ChildrenComponents,
  header,
  bundle,
  doNotUseLayout,
  Cola, pageProps
};
