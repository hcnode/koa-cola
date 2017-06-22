"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return async function requestTime(ctx, next) {
        ctx.state.middlewareOrders = ctx.state.middlewareOrders || [];
        ctx.state.middlewareOrders.push('requestTime');
        var startTime = new Date();
        await next();
        var endTime = new Date();
        if (ctx.url == '/testMiddleware') {
            ctx.body = 'requestTime:' + (endTime - startTime);
        }
    };
}
exports.default = default_1;
