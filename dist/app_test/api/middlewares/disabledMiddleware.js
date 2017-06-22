"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return async function disabledMiddleware(ctx, next) {
        ctx.state.middlewareOrders = ctx.state.middlewareOrder || [];
        ctx.state.middlewareOrders.push('disabledMiddleware');
        await next();
        if (ctx.url == '/disabledMiddleware') {
            ctx.body = ctx.state.middlewareOrders.join('-');
        }
    };
}
exports.default = default_1;
