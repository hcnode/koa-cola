/**
 * 以下export为webpack端使用
 */
import { ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps, autoRouter } from './src/decorators/views';
import { createProvider } from './src/util/createRouter';
import * as store from 'redux-connect/lib/store'

export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
export {
  // ApiBase,
  // apiFetch,
  createProvider,
  store,
  ChildrenComponents as include,
  header,
  bundle,
  doNotUseLayout,
  Cola, pageProps, autoRouter
};

export * from 'redux-connect'
export * from 'controller-decorators';
