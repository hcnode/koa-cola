"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("./src/util/decorators");
exports.Decorators = decorators_1.default;
try {
    var { run } = require('./src/app');
}
catch (e) { }
exports.RunApp = run;
