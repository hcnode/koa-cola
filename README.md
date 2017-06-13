## koa-cola

## features
* node8
* koa
* typescript
* react
* react-redux
* react-router
* both server-side and client router render
* decorators

## koa-cola目录结构
* `src` koa-cola 源码
* `app_test` app demo和测试源码
* `bin` cli 命令
* `test` 测试用例
* `typings` 类型定义（非第三方库）

## app目录结构
```javascript
{
    api : {
        controllers : // controllers层类
        middlewares : // koa中间件
        models : // model层类
        policies : // koa验证中间件
        responses : // 自定义中间件
        services : // 服务层
    },
    config : {
        env : // 基于环境的配置
        ... // 相关配置文件
    },
    public : // 静态文件目录
    views : {
        components : // react组件
        pages : {
            layout : // 页面的layout组件
            ... // 页面组件
        },
        app.tsx // 入口页面react组件
        provider.tsx // 浏览器端路由组件
        routers.tsx // 服务器端路由组件
    }
}
```


