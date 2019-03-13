declare const _default: (conf: any) => (ctx: any, next: any) => Promise<void>;
export default _default;
export declare function validateFunc({body, name, validate, allowEmpty}: {
    body: any;
    name: any;
    validate: any;
    allowEmpty?: boolean;
}): boolean;
