import * as Koa from 'koa';
import { req } from '../util/require';
export default function createMiddleware(koaApp : Koa){
    var defaultMiddlewares = require('./defaultMiddlewares').default;
    var middlewares : any = app.config.middlewares || {};
    var customMiddlewares = [];
    Object.keys(middlewares).forEach(key => {
        if(middlewares[key]){
            try{
                var module = app.middlewares[key];
                var middleware : Koa.Middleware = module.default || module;
                customMiddlewares.push({
                    name : key,
                    func : middleware
                })
            }catch(e){
                console.log(`middleware ${key} not found.`)
            }
        }else{
            defaultMiddlewares = defaultMiddlewares.filter(item => item.name != key)
        }
    });
    var combineMiddlewares = defaultMiddlewares.concat(customMiddlewares);
    var keys = combineMiddlewares.map(item => item.name);
    if(app.config.sort){
        keys = app.config.sort(keys);
    }
    keys.forEach(key => {
        var middleware = combineMiddlewares.find(item => item.name == key);
        if(middleware && middleware.func){
            console.log('mounting middleware : ' + key);
            koaApp.use(middleware.func(middleware.args))
        }
    })
}