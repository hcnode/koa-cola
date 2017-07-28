
## koa-cola
koa-cola是一个基于koa的SSR(server side render)web框架的，react完全前后端universal ("isomorphic")（server端和client端均可以使用同一套component、react-redux、react-router），并使用ts开发，使用d-mvc（es7 decorator风格的mvc），此外，作者是一个深度中毒的universal ("isomorphic") 开发模式，可以前后端复用的模块或者代码都会尽量复用，koa-cola除了react技术栈的完全前后端universal，model层的数据schema和controller的router也是可以复用。


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
#### Controller
    
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

#### View

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

#### model
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

2. 使用koa-cola的约定方式定义基于mongoose的model

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

使用cli生成model的schema

`koa-cola --schema` 自动生成model的接口定义在`typings/schema.ts`

然后你可以在代码通过使用typescript的类型定义，享受vscode的intellisense带来的乐趣
```javascript
import {userSchema} from './typings/schema' 
var user : userSchema = await app.models.user.find({name : 'harry'})
```

在前面提到的为什么需要在api/schemas定义model的schema，原因是这部分可以在浏览器端代码复用，比如数据Validate。详细可以查看[文档](http://mongoosejs.com/docs/browser.html)

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

<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api1.png" alt="Drawing" style="width: 500px;"/>
<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api2.png" alt="Drawing" width="300"/>

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
<img src="https://github.com/koa-cola/koa-cola/raw/master/screenshots/api3.png" alt="Drawing" style="width: 500px;"/>
