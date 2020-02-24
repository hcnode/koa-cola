declare const _default: (conf: any) => (ctx: any, next: any) => Promise<void>;
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
export default _default;
export declare function validateFunc({ body, name, validate, allowEmpty }: {
    body: any;
    name: any;
    validate: any;
    allowEmpty?: boolean;
}): boolean;
