"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = function () {
    return async function (ctx, next) {
        ctx.session.count = ctx.session.count || 0;
        ctx.session.count++;
        await next();
    };
};
