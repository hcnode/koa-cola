
# koa-cola
[![Build Status](https://travis-ci.org/koa-cola/koa-cola.svg?branch=develop)](https://travis-ci.org/koa-cola/koa-cola)

koa-cola是一个基于koa的SSR(server side render)web框架的，并使用ts开发，使用d-mvc（es7 decorator风格的mvc），此外，作者是一个深度中毒的universal ("isomorphic") 开发模式，react技术栈完全前后端universal ("isomorphic")（server端和client端均可以使用同一套component、react-redux、react-router），其他可以前后端复用的模块或者代码都会尽量复用，除了react技术栈的完全前后端universal，model层的数据schema和controller的router也是可以复用。

1. [特点](#特点)
2. [Getting started](#getting-started)
3. [todolist例子](#examples)
4. [开发文档](#开发文档)
    * [d-mcv](#d-mcv)
        * [Controller](#controller)
        * [View](#view)
        * [Model](#model)
    * [配置](#配置)
        * [app初始化](#app初始化)
        * [koa中间件](#koa中间件)
        * [其他配置](#其他配置)
    * [Cli](#Cli)
        * [创建koa-cola项目](#创建koa-cola项目)
        * [启动应用](#启动应用)
        * [生成model schema文件](#生成model-schema文件)
    * [代码编译](#代码编译)
        * [client](#client)
        * [server](#server)
    * [inject global](#inject-global)
    * [api开发模式](#api开发模式)
    * [universal ("isomorphic")](#universal ("isomorphic"))
    * [typescript](#typescript)
    * [cluster模式](#cluster模式)
    * [调试](#调试)
    * [production](#production)

## 特点
koa-cola的开发风格受[sails](http://sailsjs.com/)影响，之前使用过sails开发过大型的web应用，深受其[约定优先配置](https://en.wikipedia.org/wiki/Convention_over_configuration)的开发模式影响，所以此项目的比如配置模式、api目录结构也是模仿sails。
此项目还在完善中，不过已经使用过在线上活动项目，node8+原生async/await
* 使用koa作为web服务（使用node8可以完美高性能使用async/await）
* 使用typescript开发
* 使用完整的react技术栈(包括react-router和react-redux)
* react相关代码前后台复用(包括component、react-router和react-redux)
* SSR(server side render)的完整方案，只需要一份react代码便可以实现：服务器端渲染＋浏览器端bundle实现的交互


## Getting started

1. 创建koa-cola项目模版方式，通过这种方式创建出完整的项目工程，适合大型的web项目开发。
* `npm i koa-cola -g`
* `koa-cola -n app` 在当前文件夹创建新的koa-cola项目，创建完整的目录结构，并自动安装依赖
* `koa-cola -c` 执行webpack build bundle，并自动启动项目
* 访问[http://localhost:3000](http://localhost:3000)

2. 使用api方式创建项目，通过这种方式，可以一分钟内部署好koa-cola项目，适合简单短平快的web项目开发。

```javascript
import { RunApp } from 'koa-cola'
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('koa-cola').Decorators.controller;
RunApp({
    controllers: {
        FooController: @Controller('') class FooController {
            @Get('/')
            index(@Ctx() ctx) {
                return app.config.foo
            }

            @Get('/view')
            @View('some_view')
            async view( ) { 
                return await Promise.resolve({
                    foo : 'bar'
                });
            } 
        }
    },
    pages: {
        some_view : function({ctrl : {foo}}){
            return <div>{foo}</div>
        }
    }
});
```


## Examples
使用[官方react-redux的todolist](http://redux.js.org/docs/basics/UsageWithReact.html)作为基础，演示了官方的和基于koa-cola的例子（完整的mvc结构）

**demo依赖本地的mongodb**

使用方法：
* `npm i koa-cola -g`
* `git clone https://github.com/koa-cola/todolist`
* `cd todolist`
* `npm i`
* `koa-cola --cheer`
* 访问[http://localhost:3000](http://localhost:3000)，选择官方demo或者是koa-cola风格的demo

## 开发文档

## d-mcv
koa-cola可以使用es7的decorator装饰器开发模式来写mvc，controller是必须用提供的decorator来开发（因为涉及到router相关的定义），model和view层则没有强制需要demo所演示的decorator来开发。
### Controller
    
使用decorator装饰器来注入相关依赖，路由层的decorators包括router、中间件、response、view，响应阶段的decorators包括koa.Context、param、response、request等，比如以下例子：
```javascript
    @Get('/some_path')  // 定义router以及method
    @Use(isLogin)       // 使用中间件验证用户是否已登陆，类似sails的policy
    @Response(Ok)       // 定义数据返回的结构
    orderList (@Ctx() ctx, @QueryParam() param : any) { // 注入ctx和param
        // 返回数据，最终回使用Ok response结构返回
        return {
            foo : 'bar'
        }
    }
```    

    因为使用decorator定义router，所以在koa-cola里面不需要单独定义router。

### View

view层可以是简单的React.Component或者是stateless的函数组件，也可以是使用官方的react-redux封装过的组件，todolist demo的view则是使用了[redux-connect](https://github.com/makeomatic/redux-connect) 提供的decorator(当然你也可以直接用它的connect方法)，redux-connect也是基于react-redux，以下是view层支持的react组件类型。
    
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
使用这种方式的话，需要注意两点：
    * redux的reducer需要创建在组件类的静态属性`_reducer`
    * 如果有子组件也是使用redux-connect封装，则需要在组件类建立静态属性`childrenComponents`
    * 以上两点可以参考todolist的[代码](https://github.com/koa-cola/todolist/blob/master/views/pages/colastyleDemo.tsx)

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

### Model
和必须使用decorator的controller层、必须使用react组件的view层不一样，model层是完全没有耦合，你可以使用任何你喜欢的orm或者odm，或者不需要model层也可以，不过使用koa-cola风格的来写model，你可以体验不一样的开发模式。

1. 你可以直接在目录api/models下创建如user.ts：
```javascript
import * as mongoose from 'mongoose'
export default mongoose.model('user', new mongoose.Schema({
    name : String,
    email : String
}))
```

然后就可以在其他代码里面使用：
```javascript
var user = await app.models.user.find({name : 'harry'})
```

2. 使用koa-cola的风格写model

首先在`api/schemas`目录创建user.ts

```javascript
export const userSchema = function(mongoose){
    return {
        name: {
            type : String
        },
        email : {
            type : String
        }
    }
}
```

在目录`api/models`下创建model如user.ts：
```javascript
import * as mongoose from 'mongoose'
import userSchema from '../schemas/user'
export default mongoose.model('user', userSchema(mongoose))
```

当然也可以使用decorator方式定义model，还可以定义相关hook，详情可以参考[mongoose-decorators](https://github.com/aksyonov/mongoose-decorators)

```javascript
import { todoListSchema } from '../schemas/todoList';
var { model } = app.decorators.model;

@model(todoListSchema(app.mongoose))
export default class TodoList {}
```

使用cli生成model的schema

`koa-cola --schema` 自动生成model的接口定义在`typings/schema.ts`

然后你可以在代码通过使用typescript的类型定义，享受vscode的intellisense带来的乐趣
```javascript
import {userSchema} from './typings/schema' 
var user : userSchema = await app.models.user.find({name : 'harry'})
```

在前面提到的为什么需要在api/schemas定义model的schema，除了上面可以自动生成schema的接口，这部分可以在浏览器端代码复用，比如数据Validate。详细可以查看[文档](http://mongoosejs.com/docs/browser.html)

3. koa-cola提供了前后端universal的api接口定义，比如todolist demo的获取数据的接口定义

```javascript
import { todoListSchema } from './typings/schema';
import { ApiBase, apiFetch } from 'koa-cola';

export class GetTodoList extends ApiBase<
  {
      // 参数类型
  },
  {
    code: number;
    result: [todoListSchema];
  },
  {
      // 异常定义
  }
> {
  constructor(body) {
    super(body);
  }
  url: string = '/api/getTodoList';
  method: string = 'get';
}
```

在代码里面使用api，并享受ts带来的乐趣：
```javascript
var api = new GetTodoList({});
var data = await api.fetch(helpers.ctx);
```

<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api1.png" alt="Drawing" width="600"/>
<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api2.png" alt="Drawing" width="600"/>

又比如参数body的定义，如果定义了必传参数，调用时候没有传，则vscode会提示错误
```javascript
import { testSchema } from './typings/schema';
import { ApiBase, apiFetch } from 'koa-cola'
export interface ComposeBody{
    foo : string,
    bar? : number
}
export class Compose extends ApiBase<ComposeBody, testSchema, {}>{
    constructor(body : ComposeBody){
        super(body)
    }
    url : string = '/compose'
    method : string = 'post'
}
```
<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api3.png" alt="Drawing" width="600"/>


## 配置
通过约定config目录下所有文件都会成为config的属性，运行时会被env环境下的配置覆盖，所有配置会暴露在app.config。

	> config
	    > env
            local.js
            test.js
            development.js
        development.js
        production.js
        any_config_you_need.js 
        ...

比如配置any_config_you_need.js 

    exports.module = {
        foo : 'bar'
    }


如果当前是development环境，并且config/env/development.js:

    exports.module = {
        foo : 'wow'
    }

那么`app.config.foo == 'wow'`

### app初始化
在config目录下面的bootstrap.js可以定义初始化调用，在app启动时调用，如：

```javascript
module.exports = function(koaApp){
	koaApp.proxy = true;
	app.mongoose.Promise = global.Promise;
	if(process.env.NODE_ENV != 'test'){
		app.mongoose.connect(app.config.mongodb); 
	}
};
```
### koa中间件
koa-cola默认会使用以下几个中间件，并按照这个顺序：
1. koa-response-time
2. koa-favicon
3. koa-etag
4. koa-morgan
5. koa-compress
6. koa-static

参数详情可以查看[这里](https://github.com/koa-cola/koa-cola/blob/master/src/middlewares/defaultMiddlewares.ts)

如果开发者希望修改默认的中间件，或者添加自定义的中间件，又或者希望重新排序，可以通过config.middlewares来修改默认：

```javascript
module.exports = {
    // 添加自定义中间件，或者禁用默认中间件
    // 自定义中间件在api/middlewares下提供
	middlewares : {
		checkMiddlewareOrder : true,
		requestTime : true,
		disabledMiddleware : false,
		sessionTest : true,
		middlewareWillDisable : true
	},
    // 重新排序
	sort : function(middlewares){
		return middlewares;
	}
};
```

### 其他配置
默认的配置包括端口默认是5555，session默认是使用内存模式，如果需要修改可以在config下或者对应的config/env下修改

## Cli
koa-cola提供了一些有用的cli命令，包括新建项目、启动项目、生成model schema文件

### 创建koa-cola项目

`koa-cola --new app` 或者 `koa-cola --n app` 在当前目录创建文件夹名字为app的模版项目，并自动安装依赖，和自动build bundle和启动应用。

### 启动应用

`koa-cola` 在项目目录里面执行，启动项目，node端启动app项目，但是不会build bundle

`koa-cola --cheer` 或者 `koa-cola -c` 先build bundle，再launch app

### 生成model schema文件

`koa-cola --schema` 或者 `koa-cola --s` 生成`api/schenmas`下面的model schema定义，保存在`typings/schema.ts`

## 代码编译

### client
前端的bundle build使用webpack来构建，使用cli命令创建项目，会自动生成[webpack配置](https://github.com/koa-cola/koa-cola/blob/master/template/webpack.config.js)
ts文件的loader使用了[awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader)，并配置了使用babel，加入babel-polyfill到bundle，可以兼容ie9+。

webpack的入口tsx文件在项目里面的`view/app.tsx`:
```javascript
import * as React from 'react';
import { render } from 'react-dom';
import IndexController from '../api/controllers/IndexController';
import index from './pages/index';
import officialDemo from './pages/officialDemo';
import colastyleDemo from './pages/colastyleDemo';

var { createProvider } = require('koa-cola');
// 使用koa-cola提供的createProvider会自动建立路由，如果手动使用官方的Provider，则需要开发者手动写router
var Provider = createProvider([IndexController], {
  index,
  officialDemo,
  colastyleDemo
});

render(<Provider />, document.getElementById('app'));

```

### server
koa-cola本身框架只编译了部分代码，比如es6的module import和export，ts类型相关的语法，对es6或者es7（比如async/await）没有进行编译，尽量用到node.js原生的es高级语法（所以会不支持低版本的node），如果你想希望你的应用在低版本node下使用，则需要你手动build出你所希望的代码，并包括所依赖的koa-cola库。

如果在node.js 8.0的环境下运行，则可以不需要任何编译，可以直接使用ts-node运行（cli运行命令都是使用ts-node），甚至可以直接[线上使用](https://github.com/TypeStrong/ts-node/issues/104)

## inject global
全局依赖注入，有时候在其他非应用运行时引用koa-cola里面的文件时，会因为文件依赖`app.xxx`而出错，使用inject global方式，可以实现第三方非koa-cola的require。
```javascript
import { reqInject } from 'koa-cola'
var user;
reqInject(function(){
    user = require('./api/models/user').default // 直接require项目内的文件
    var config = app.config; // 或者app当前配置
});
```

## api开发模式
前面提到的开发模式都是基于项目的文件目录，koa-cola还提供直接使用api的方式运行：

```javascript
import { RunApp } from 'koa-cola'
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('koa-cola').Decorators.controller;
RunApp({
    config: {
        foo: 'bar',
        middlewares: {
            some_middleware : true
        }
    },
    controllers: {
        FooController: @Controller('') class FooController {
            @Get('/')
            index(@Ctx() ctx) {
                return app.config.foo
            }

            @Get('/view')
            @View('some_view')
            view( ) { } 
        }
    },
    middlewares: {
        some_middleware: function some_middleware() {
            return async function (ctx, next) {
                ctx.state.bar = 'barrrrr';
                await next();
            }
        }
    },
    pages: {
        some_view : function(){
            return <div></div>
        }
    },
    models : {
        // ...
    }
});
```

## universal ("isomorphic")

## typescript

## cluster模式

## 调试

## production