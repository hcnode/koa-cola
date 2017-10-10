"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 定义mvc的decorators
 */
const controllerDecorators = require("controller-decorators");
// import * as mongooseDecorators from 'mongoose-decorators';
const reduxConnect = require("redux-connect");
const views_1 = require("../decorators/views");
try {
    var mongooseDecorators = require('mongoose-decorators');
}
catch (e) { }
exports.default = {
    controller: controllerDecorators,
    model: mongooseDecorators,
    view: Object.assign(reduxConnect, {
        store: require('redux-connect/lib/store'),
        include: views_1.ChildrenComponents
    })
};
//# sourceMappingURL=decorators.js.map