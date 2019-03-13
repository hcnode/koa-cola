"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * post表单验证中间件
 * conf ={
 *  path,
 *  fields : [
 *      {
 *          field,
 *          validate,
 *          allowEmpty, // default is false
 *          msg,
 *      }
 *  ]
 * }
 */
exports.default = (conf) => {
    return async (ctx, next) => {
        var path = ctx.path;
        if (ctx.method.toLowerCase() == "post" && path == conf.path) {
            var body = ctx.request.body || {};
            var fields = conf.fields || [];
            for (var field of fields) {
                if (!validateFunc(Object.assign({}, field, { body }))) {
                    throw ({ status: 400, message: field.msg });
                }
            }
        }
        await next();
    };
};
function validateFunc({ body, name, validate, allowEmpty = false }) {
    if (!allowEmpty && !(name in body)) {
        return false;
    }
    if (!validate)
        return true;
    var value = body[name];
    var isReg = validate instanceof RegExp;
    if (isReg && !value.match(validate)) {
        return false;
    }
    var isFunc = validate instanceof Function;
    if (isFunc && !validate(value)) {
        return false;
    }
    return true;
}
exports.validateFunc = validateFunc;
//# sourceMappingURL=validate.js.map