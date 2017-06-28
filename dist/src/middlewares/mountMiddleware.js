"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var require_1 = require("../util/require");
function createMiddleware(koaApp) {
    var defaultMiddlewares = require('./defaultMiddlewares').default;
    var middlewares = app.config.middlewares || {};
    var customMiddlewares = [];
    Object.keys(middlewares).forEach(function (key) {
        if (middlewares[key]) {
            try {
                var module = require_1.req(process.cwd() + "/api/middlewares/" + key);
                var middleware = module.default || module;
                customMiddlewares.push({
                    name: key,
                    func: middleware
                });
            } catch (e) {
                console.log("middleware " + key + " not found.");
            }
        } else {
            defaultMiddlewares = defaultMiddlewares.filter(function (item) {
                return item.name != key;
            });
        }
    });
    var combineMiddlewares = defaultMiddlewares.concat(customMiddlewares);
    var keys = combineMiddlewares.map(function (item) {
        return item.name;
    });
    if (app.config.sort) {
        keys = app.config.sort(keys);
    }
    keys.forEach(function (key) {
        var middleware = combineMiddlewares.find(function (item) {
            return item.name == key;
        });
        if (middleware && middleware.func) {
            console.log('mounting middleware : ' + key);
            koaApp.use(middleware.func(middleware.args));
        }
    });
}
exports.default = createMiddleware;