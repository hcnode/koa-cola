"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllerDecorators = require("controller-decorators");
const mongooseDecorators = require("mongoose-decorators");
const reduxConnect = require("redux-connect");
const reducer_1 = require("../decorators/reducer");
exports.default = {
    controller: controllerDecorators,
    model: mongooseDecorators,
    view: Object.assign(reduxConnect, { SyncReducer: reducer_1.Reducer }, { store: require('redux-connect/lib/store') })
};
