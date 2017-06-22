"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1() {
    return async function disabledMiddleware(ctx, next) {
        ctx.session.disabledMiddleware = 'enable';
        await next();
    };
}
exports.default = default_1;
