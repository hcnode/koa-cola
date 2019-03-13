/// <reference types="react" />
/**
 * 创建node端react路由并保存在全局app.routers.router
 * @param routers
 */
export default function createRouter(routers: any, pages?: any): any;
/**
 * 参考 app_test/views/app.tsx :
 *
 *
  var Provider = createProvider([
      {
        "component": "simple",
        "path": "/simple",
        "page" : require('./pages/simple').default
      },
  ]);

  render(<Provider />, document.getElementById('app'))

 * @param controllers controller数组
 * @param views react page页面数组
 */
export declare function createProvider(routers: any, reduxMiddlewares?: any): () => JSX.Element;
