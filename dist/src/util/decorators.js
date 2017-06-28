"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var controllerDecorators = require("controller-decorators");
var mongooseDecorators = require("mongoose-decorators");
var reduxConnect = require("redux-connect");
var reducer_1 = require("../decorators/reducer");
exports.default = {
    controller: controllerDecorators,
    model: mongooseDecorators,
    view: Object.assign(reduxConnect, { SyncReducer: reducer_1.Reducer }, { store: require('redux-connect/lib/store') })
};