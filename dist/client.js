"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps } = require('./src/decorators/views');
const { createProvider } = require('./src/util/createRouter');
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
module.exports = Object.assign({ 
    // ApiBase,
    // apiFetch,
    createProvider }, reduxConnect, controllerDecorators, exports, { store: require('redux-connect/lib/store'), colaReducer: ColaReducer, include: ChildrenComponents, header,
    bundle,
    doNotUseLayout,
    Cola, pageProps });
