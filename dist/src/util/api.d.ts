export declare class Base<B, R, E> {
    constructor(body: B);
    url: string;
    method: string;
    body: B;
    result: R;
    exception: E;
    headers: any;
    fetch(ctx?: any): Promise<this>;
}
/**
 * fetch请求数据
 * @param api
 * @param ctx koa.Context对象，如果有ctx参数，表示在node端请求
 */
export declare function fetch<B, R, E, A extends Base<B, R, E>>(api: A, ctx?: any): Promise<A>;
