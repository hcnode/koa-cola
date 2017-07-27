## koa-cola
koa-cola是一个基于koa的SSR(server side render)web框架的，react完全前后端universal（server端和client端均可以使用同一套component、react-redux、react-router），并使用ts开发，使用d-mvc（es7 decorator风格的mvc）。


### 特点
koa-cola的开发风格受[sails](http://sailsjs.com/)影响，之前使用过sails开发过大型的web应用，深受其[约定优先配置](https://en.wikipedia.org/wiki/Convention_over_configuration)的开发模式影响，所以此项目的比如配置模式、api目录结构也是模仿sails。
此项目还在完善中，不过已经使用过在线上活动项目，node8+原生async/await
* 使用koa作为web服务（使用node8可以完美高性能使用async/await）
* 使用typescript开发
* 使用完整的react技术栈(包括react-router和react-redux)
* react相关代码前后台复用(包括component、react-router和react-redux)
* SSR(server side render)的完整方案，只需要一份react代码便可以实现：服务器端渲染＋浏览器端bundle实现的交互


### 使用方法
* `npm i koa-cola -g`
* `koa-cola -n app` 在当前文件夹创建新的koa-cola项目，创建完整的目录结构，并自动安装依赖，并自动使用webpack build bundle，并自动启动项目
* 访问[http://localhost:3000](http://localhost:3000)

### Examples
使用[官方react-redux的todolist](http://redux.js.org/docs/basics/UsageWithReact.html)作为基础，演示了官方的和基于koa-cola的例子（完整的mvc结构）
**demo依赖本地的mongodb**
使用方法：
* `npm i koa-cola -g`
* `git clone https://github.com/koa-cola/todolist`
* `cd todolist`
* `npm i`
* `koa-cola --cheer`
* 访问[http://localhost:3000](http://localhost:3000)，选择官方demo或者是koa-cola风格的demo

### 开发文档

### d-mcv
koa-cola可以使用es7的decorator装饰器开发模式来写mvc，controller是必须用提供的decorator来开发（因为涉及到router相关的定义），model和view层则没有强制需要demo所演示的decorator来开发。
* Controller
    
    使用decorator装饰器来注入相关依赖，路由层的decorators包括router、中间件、response、view，响应阶段的decorators包括koa.Context、param、response、request等：
```javascript
    @Get('/some_path')  // 定义router已经method
    @Use(isLogin)       // 验证用户是否已登陆，类似sails的policy
    @Response(Ok)       // 定义数据返回的结构
    isLogin (@Ctx() ctx, @QueryParam() param : any) { // 注入ctx和param
        // 返回数据，最终回使用Ok response结构返回
        return {
            foo : 'bar'
        }
    }
```    

    因为使用decorator定义router，所以在koa-cola里面不需要单独定义router。

* View

    view层可以是简单的React.Component或者是stateless的函数组件，也可以是使用官方的react-redux封装过的组件，todolist demo的view则是使用了[redux-connect](https://github.com/makeomatic/redux-connect) 提供的decorator(当然你也可以直接用它的connect方法)，redux-connect也是基于react-redux。
    
1. React.Component组件

```javascript
    class Index extends React.Component<Props, States>   {
        constructor(props: Props) {
            super(props);
        }
        static defaultProps = {
            
        };
        render() {
            return <h1>Wow koa-cola!</h1>
        }
    };
    export default Index
```

2. stateless组件

```javascript
    export default function({some_props}) {
        return <h1>Wow koa-cola!</h1>
    }
```

3. react-redux组件

```javascript
    import { connect } from 'react-redux'
    var Index = function({some_props}) {
        return <h1>Wow koa-cola!</h1>
    }
    export default connect(
        mapStateToProps,
        mapDispatchToProps
    )(Index)
```

4. redux-connect的decorator
```javascript
    var {
        asyncConnect,
    } = require('koa-cola').Decorators.view;

    @asyncConnect(
    [{
        key: 'some_props',
        promise: async ({ params, helpers}) => {
            return Promise.resolve('this will go to this.props.some_props')
        }
    }],
    mapStateToProps,
    mapDispatchToProps
    )
    class Index extends React.Component<Props, States>   {
        constructor(props: Props) {
            super(props);
        }
        static defaultProps = {
            
        };
        render() {
            return <h1>Wow koa-cola!</h1>
        }
    };
    export default Index
```


