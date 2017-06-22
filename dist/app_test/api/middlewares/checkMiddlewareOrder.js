"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkMiddlewareOrder = function () {
    return async function (ctx, next) {
        ctx.state.middlewareOrders = ctx.state.middlewareOrder || [];
        ctx.state.middlewareOrders.push('checkMiddlewareOrder');
        await next();
        if (ctx.url == '/checkMiddlewareOrder') {
            ctx.body = ctx.state.middlewareOrders.join('-');
        }
    };
};
module.exports = checkMiddlewareOrder;
