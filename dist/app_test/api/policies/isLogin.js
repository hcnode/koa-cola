"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function isLogin(ctx, next) {
    if (ctx.state.user) {
        await next();
    }
    else {
        ctx.throw(401);
    }
}
exports.default = isLogin;
