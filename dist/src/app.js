"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 启动文件
 */
const index_1 = require("./index");
var server;
process.on('unhandledRejection', error => {
    /* istanbul ignore next */
    console.error('unhandledRejection', require('util').inspect(error));
});
function run(colaApp) {
    if (server) {
        server.close();
    }
    server = index_1.default(colaApp);
    return server;
}
exports.run = run;
//# sourceMappingURL=app.js.map