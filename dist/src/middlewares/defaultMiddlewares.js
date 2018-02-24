"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * koa-cola默认中间件，这些中间件可以通过app.config.middlewares启用或者禁用，也可以修改参数
 * 并可以通过配置app.config.sort进行排序
 */
const fs = require("fs");
exports.default = [
    {
        name: 'koa-response-time',
        func: require('koa-response-time')
    },
    fs.existsSync(`${process.cwd()}/public/favicon.ico`) ? {
        name: 'koa-favicon',
        func: require('koa-favicon'),
        args: require.resolve(`${process.cwd()}/public/favicon.ico`)
    } : Object.assign({}),
    {
        name: 'koa-etag',
        func: require('koa-etag')
    },
    {
        name: 'koa-morgan',
        func: function (args) {
            !fs.existsSync(args) && fs.mkdirSync(args);
            return require('koa-morgan')('combined', {
                stream: fs.createWriteStream(args + '/access.log', { flags: 'a' })
            });
        },
        args: () => {
            var logPath = app.config.accessLogPath || process.cwd();
            !fs.existsSync(logPath) && fs.mkdirSync(logPath);
            return `${logPath}/logs`;
        }
    },
    {
        name: 'koa-compress',
        func: require('koa-compress'),
        args: {
            flush: require('zlib').Z_SYNC_FLUSH
        }
    },
    {
        name: 'koa-bodyparser',
        func: require('koa-bodyparser'),
        args: {}
    },
    {
        name: 'koa-static',
        func: require('koa-static'),
        args: () => `${process.cwd()}/public`
    },
];
//# sourceMappingURL=defaultMiddlewares.js.map