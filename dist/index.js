"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 以下injectGlobal，RunApp，reqInject为node端使用
 */
try {
    var { run } = require('./src/app');
    var injectGlobal = require('./src/util/injectGlobal').default;
    exports.injectGlobal = injectGlobal;
    exports.RunApp = run;
    exports.reqInject = function (path, cb) {
        var currentPath = process.cwd();
        process.chdir(path);
        if (!global.app)
            injectGlobal();
        process.chdir(currentPath);
        cb && cb();
    };
}
catch (e) { }
const controllerDecorators = require('controller-decorators');
const reduxConnect = require('redux-connect');
const views_1 = require("./src/decorators/views");
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
var createRouter_1 = require("./src/util/createRouter");
exports.createProvider = createRouter_1.createProvider;
var mongooseDecorators = require('mongoose-decorators');
exports.Decorators = {
    controller: controllerDecorators,
    model: mongooseDecorators,
    view: Object.assign({}, reduxConnect, { store: require('redux-connect/lib/store'), colaReducer: views_1.ColaReducer, Cola: views_1.Cola, include: views_1.ChildrenComponents, header: views_1.header, bundle: views_1.bundle, doNotUseLayout: views_1.doNotUseLayout, pageProps: views_1.pageProps })
};
