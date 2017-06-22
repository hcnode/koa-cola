"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function setUser(ctx, next) {
    ctx.state.user = { name: 'harry' };
    await next();
}
exports.default = setUser;
