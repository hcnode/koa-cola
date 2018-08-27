import { run } from "./src/app";
import injectGlobal from "./src/util/injectGlobal";
export { Base as ApiBase, fetch as apiFetch } from "./src/util/api";
export { createProvider } from "./src/util/createRouter";
export { injectGlobal, run as RunApp };
export declare function reqInject(path: any, cb: any): void;
export declare const Decorators: {
    controller: any;
    model: any;
    view: any;
};
