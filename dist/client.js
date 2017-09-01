"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 以下export为webpack端使用
 */
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const { ColaReducer, ChildrenComponents, header, bundle, doNotUseLayout, Cola, pageProps } = require('./src/decorators/views');
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
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
        doNotUseLayout,
        Cola, pageProps
    })
};
