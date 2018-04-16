import { run } from "./src/app";
import injectGlobal from "./src/util/injectGlobal";
import mongooseDecorators from "mongoose-decorators";

import controllerDecorators from "controller-decorators";
import * as reduxConnect from "redux-connect";
import {
  Cola,
  ChildrenComponents,
  header,
  bundle,
  doNotUseLayout,
  pageProps,
  autoRouter
} from "./src/decorators/views";
import * as store from 'redux-connect/lib/store'
export { Base as ApiBase, fetch as apiFetch } from "./src/util/api";
export { createProvider } from "./src/util/createRouter";
export { injectGlobal, run as RunApp };
export function reqInject(path, cb) {
  var currentPath = process.cwd();
  process.chdir(path);
  if (!global.app) injectGlobal();
  process.chdir(currentPath);
  cb && cb();
}
export const Decorators = {
  controller: controllerDecorators,
  model: mongooseDecorators,
  view: {
    ...reduxConnect,
    store,
    Cola,
    include: ChildrenComponents,
    header,
    bundle,
    doNotUseLayout,
    pageProps,
    autoRouter
  }
};
