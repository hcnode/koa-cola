"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps } = require('./src/decorators/views');
const api_1 = require("./src/util/api");
const { createProvider } = require('./src/util/createRouter');
module.exports = Object.assign({ ApiBase: api_1.Base,
    apiFetch: api_1.fetch,
    createProvider }, controllerDecorators, { store: require('redux-connect/lib/store'), colaReducer: ColaReducer, include: ChildrenComponents, header,
    bundle,
    doNotUseLayout,
    Cola, pageProps });
