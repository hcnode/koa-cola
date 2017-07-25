"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
try {
    var { run } = require('./src/app');
}
catch (e) { }
exports.RunApp = run;
try {
    var injectGlobal = require('./src/util/injectGlobal');
    exports.injectGlobal = injectGlobal;
}
catch (e) { }
var createRouter_1 = require("./src/util/createRouter");
exports.createProvider = createRouter_1.createProvider;
const controllerDecorators = require("controller-decorators");
const reduxConnect = require("redux-connect");
/* try {
    var mongooseDecorators = require('mongoose-decorators');
}
catch (e) { } */
exports.Decorators = {
    controller: controllerDecorators,
    // model: mongooseDecorators,
    view: Object.assign(reduxConnect, { store: require('redux-connect/lib/store') })
};
