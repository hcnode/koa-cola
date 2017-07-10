"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * default middlewares of koa
 * these middleware can be enabled or disabled or change arguments in app.config.middlewares
 * and be sorted in app.config.sort
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
        args: `${process.cwd()}/logs`
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
        args: `${process.cwd()}/public`
    },
];
