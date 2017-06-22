"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Ok(ctx, data) {
    ctx.status = 200;
    if (data) {
        ctx.body = {
            code: 200,
            result: data
        };
    }
}
exports.default = Ok;
