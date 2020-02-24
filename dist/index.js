"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
exports.RunApp = app_1.run;
const injectGlobal_1 = require("./src/util/injectGlobal");
exports.injectGlobal = injectGlobal_1.default;
const mongoose_decorators_1 = require("mongoose-decorators");
const controller_decorators_1 = require("controller-decorators");
const reduxConnect = require("redux-connect-new");
const views_1 = require("./src/decorators/views");
const store = require("redux-connect-new/lib/store");
var api_1 = require("./src/util/api");
exports.ApiBase = api_1.Base;
exports.apiFetch = api_1.fetch;
var createRouter_1 = require("./src/util/createRouter");
exports.createProvider = createRouter_1.createProvider;
function reqInject(path, cb) {
    var currentPath = process.cwd();
    process.chdir(path);
    if (!global.app)
        injectGlobal_1.default();
    process.chdir(currentPath);
    cb && cb();
}
exports.reqInject = reqInject;
exports.Decorators = {
    controller: controller_decorators_1.default,
    model: mongoose_decorators_1.default,
    view: Object.assign(Object.assign({}, reduxConnect), { store,
        Cola: views_1.Cola, include: views_1.ChildrenComponents, header: views_1.header,
        bundle: views_1.bundle,
        doNotUseLayout: views_1.doNotUseLayout,
        pageProps: views_1.pageProps,
        autoRouter: views_1.autoRouter })
};
//# sourceMappingURL=index.js.map