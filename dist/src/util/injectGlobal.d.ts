/**
 * 全局变量注入，启动时，koa-cola读取所依赖的的api相关对象都将读取app.xxx，而不是读基于文件的对象
 */
import * as Router from 'koa-router';
export default function inject(colaApp?: any): Router<any, {}>;
