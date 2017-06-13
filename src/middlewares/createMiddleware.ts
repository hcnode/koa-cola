import * as Koa from 'koa';
import { req } from '../util/require';
export default function createMiddleware(app : Koa){
    var config : any = require(`${process.cwd()}/config/middlewares`).middlewares || {};
    Object.keys(config).forEach(key => {
        if(config[key]){
            var module = req(`${process.cwd()}/api/middlewares/${key}`);
            var middleware : Koa.Middleware = module;
            app.use(middleware);
        }
    });
}