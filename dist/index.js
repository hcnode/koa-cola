"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./src/util/decorators");
exports.Decorators = decorators_1.default;
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
}
catch (e) { }
var createRouter_1 = require("./src/util/createRouter");
exports.createProvider = createRouter_1.createProvider;
