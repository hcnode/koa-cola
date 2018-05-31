
# koa-cola
[![Build Status](https://travis-ci.org/hcnode/koa-cola.svg?branch=master)](https://travis-ci.org/hcnode/koa-cola)
[![Coverage Status](https://coveralls.io/repos/github/hcnode/koa-cola/badge.svg?branch=master)](https://coveralls.io/github/hcnode/koa-cola?branch=master)
[![npm](https://img.shields.io/npm/v/koa-cola.svg)](https://www.npmjs.com/package/koa-cola)

[中文版readme](https://github.com/hcnode/koa-cola/blob/master/README_zh.md)

[koa-cola](https://koa-cola.github.io/) is SSR(server side render)/SPA(singe page application) framework with koa/react/react-router/redux/typescript, and using react stack(react component/react-router/react-redux) and "isomorphic" codes (used in both browser and server side).


### Features
* completely and seamlessly SSR/SPA solution
* "isomorphic" component/router/redux/ajax in both client and server side
* typescript
* es7 decorator/async coding style

## Usage

because koa-cola require latest koa version.

> Koa requires node v7.6.0 or higher for ES2015 and async function support.

so koa-cola requires node v7.6.0 or higher as well. Node.js v8 comes with significantly improved performance of ES2017 async functions, so node v8 or higher is recommended. 

* `npm i koa-cola -g` install global koa-cola
* `koa-cola new koa-cola-app` create new koa-cola project in current folder
* `cd koa-cola-app`
* `npm run dev` start dev mode to build bundle and launch server.

source code of koa-cola-app/views/pages/index.tsx:
```tsx
import * as React from "react";
import { Cola, store } from "koa-cola/client";
import { GetFooApi } from "../../api";
var loadSuccess = store.loadSuccess;
// api同构调用，可能在服务器端调用，也可能在浏览器端调用，区别是是否存在koa的ctx对象
async function callApi(ctx?) {
  var getFooApi = new GetFooApi({});
  await getFooApi.fetch(ctx);
  var result: any = getFooApi.result;
  return `api called from ${ctx ? "server" : "client"}, data:${result.data}`;
}

@Cola({
  // redux同构，页面请求时，数据在服务器端初始化；单页面跳转时，数据在浏览器端异步请求
  initData: {
    hello: () => {
      return Promise.resolve("Wow koa-cola!");
    },
    apiDataCallFromServer: async ({ params, helpers }) => {
      return await callApi(helpers.ctx);
    }
  },
  // react-redux "mapDispatchToProps"
  mapDispatchToProps: dispatch => {
    return {
      // 修改redux同构的props
      onClick: () => {
        dispatch(loadSuccess("hello", "Wow koa-cola and bundle work!"));
      },
      // 浏览器端redux流
      callApiFromClient: async () => {
        var data = await callApi();
        dispatch({
          type: "CALL_API",
          data
        });
      },
      // 使用了redux-thunk中间件，中间件定义在/config/reduxMiddlewares.js
      reduxThunk: () => {
        return dispatch(async () => {
          await new Promise((resolve, reject) => setTimeout(resolve, 1000));
          dispatch({
            type: "REDUX_THUNK",
            data: "this is from reduxMiddleware"
          });
        });
      }
    };
  },
  // react-redux "mapStateToProps"
  mapStateToProps: state => {
    return state;
  },
  // reducer of redux
  reducer: {
    apiDataCallFromClient: (state = "", action) => {
      switch (action.type) {
        case "CALL_API":
          return action.data;
        default:
          return state;
      }
    },
    dataFromReduxThunk: (state = "", action) => {
      switch (action.type) {
        case "REDUX_THUNK":
          return action.data;
        default:
          return state;
      }
    }
  }
})
export default class App extends React.Component<any, any> {
  render() {
    return (
      <div>
        <h1>{this.props.hello}</h1>
        <button onClick={this.props.onClick}>check bundle if work</button>&nbsp;
        <button onClick={this.props.callApiFromClient}>call from client</button>&nbsp;
        <button onClick={this.props.reduxThunk}>redux thunk</button>&nbsp;
        <div>
          redux date flow in server side : {this.props.apiDataCallFromServer} <br />
          redux date flow in client side : {this.props.apiDataCallFromClient} <br />
          redux middleware : {this.props.dataFromReduxThunk} <br />
        </div>
      </div>
    );
  }
}

```



## Compare next.js
[next.js](https://github.com/zeit/next.js) is one of the popular SSR and reactjs base frameworks, but some difference between koa-cola and next.js.

### fetch data
next.js provide static method "getInitialProps" to fetch data：
```javascript
import React from 'react'
export default class extends React.Component {
  static async getInitialProps ({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

koa-cola provide two ways to fetch data.

1. use Cola decorator to fetch data:
```javascript
import React from 'react'
var { Cola } = require('koa-cola/client');

@Cola({
  initData : {
    userAgent : req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
})
export default class extends React.Component {
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

2. fetch data in server router
```javascript
// in controller
@Controller('') 
class FooController {
    @Get('/some_page')  
    @View('some_page') 
    some_page (@Ctx() ctx) { 
      return userAgent: ctx.req.headers['user-agent']
    }
}

// in page
export default function({ ctrl : {userAgent} }) {
  return <div>
    Hello World {userAgent}
  </div>
}
```

the first way fetch data in koa-cola props actually come from react-redux, because koa-cola combines all pages reducer into redux, so in browser espcially in SPA, you can share this kind of props in all pages. while next.js has not support this yet.

### support children components data fetch

next.js does not support fetch data in children components:
> Note: getInitialProps can not be used in children components. Only in pages.

but in koa-cola this can easy be supported by using the decorator "include":

```javascript
// in child component
@Cola({
  initData : {
    userAgent : req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
})
class Child extends React.Component {
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}


// in page
var { Cola, include } = require('koa-cola/client');
@include({
  Child
})
export default class Page extends React.Component{
  render() {
    return <div>
        <Child {...this.props} />
      </div>
  }
}

```

[online demo](http://koa-cola.com:3000/)

visit [koa-cola website](https://koa-cola.github.io/) for more detail
