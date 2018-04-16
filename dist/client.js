"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 以下export为webpack端使用
 */
const views_1 = require("./src/decorators/views");
exports.include = views_1.ChildrenComponents;
exports.header = views_1.header;
exports.bundle = views_1.bundle;
exports.doNotUseLayout = views_1.doNotUseLayout;
exports.Cola = views_1.Cola;
exports.pageProps = views_1.pageProps;
exports.autoRouter = views_1.autoRouter;
const createRouter_1 = require("./src/util/createRouter");
exports.createProvider = createRouter_1.createProvider;
const store = require("redux-connect/lib/store");
exports.store = store;
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
__export(require("redux-connect"));
__export(require("controller-decorators"));
//# sourceMappingURL=client.js.map