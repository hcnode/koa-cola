"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 启动文件
 */
const index_1 = require("./index");
var server;
function run() {
    if (server) {
        server.close();
    }
    server = index_1.default();
    return server;
}
exports.run = run;
