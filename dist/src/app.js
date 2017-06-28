"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var server;
// run();
function run() {
    if (server) {
        server.close();
    }
    server = index_1.default();
    return server;
}
exports.run = run;