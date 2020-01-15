
# koa-cola
[![996.icu](https://img.shields.io/badge/link-996.icu-red.svg)](https://996.icu)
[![Build Status](https://travis-ci.org/hcnode/koa-cola.svg?branch=master)](https://travis-ci.org/hcnode/koa-cola)
[![Coverage Status](https://coveralls.io/repos/github/hcnode/koa-cola/badge.svg?branch=master)](https://coveralls.io/github/hcnode/koa-cola?branch=master)
[![npm](https://img.shields.io/npm/v/koa-cola.svg)](https://www.npmjs.com/package/koa-cola)

[koa-cola](http://www.koa-cola.com)是一个基于koa和react的服务器端SSR(server side render)和浏览器端的SPA(single page application)的web前后端全栈应用框架。

koa-cola使用typescript开发，使用d-mvc（es7 decorator风格的mvc）开发模式。另外koa-cola大量使用universal ("isomorphic") 开发模式，比如react技术栈完全前后端universal（server端和client端均可以使用同一套component、redux、router）。

## 特点
* SSR+SPA的完整方案，只需要一份react代码便可以实现：服务器端渲染＋浏览器端bundle实现的交互
* 前后端同构，包括组件/路由/redux/ajax/validation的同构
* 使用typescript开发
* 使用es7的decorator和async/await编码风格

**最新的v0.6.1支持react16和react-router v4**

**validation前后端同构在最新的v0.7支持**，详细可以[查看](https://koa-cola-zh-cn.github.io/universal-validation.html)

## 如何使用

koa-cola支持node.js的版本包括7.6和8，建议使用8，因为8.0使用的最新的v8版本，而且8.0会在[今年10月正式激活LTS](https://github.com/nodejs/LTS)，因为koa-cola的async/await是原生方式使用没有经过transform，所以不支持node7.6以下的node版本。

* `npm i koa-cola -g` 安装全局koa-cola
* `koa-cola new koa-cola-app` 在当前文件夹创建名字为app的新koa-cola项目，创建完整的目录结构，并自动安装依赖
* `cd koa-cola-app`
* `npm run dev` dev模式启动，build webpack bundle、launch项目、并自动打开浏览器

Cola 装饰器使用方法：

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
          redux data flow in server side : {this.props.apiDataCallFromServer} <br />
          redux data flow in client side : {this.props.apiDataCallFromClient} <br />
          redux middleware : {this.props.dataFromReduxThunk} <br />
        </div>
      </div>
    );
  }
}

```


本地运行demo：
* `git clone https://github.com/koa-cola/todolist`
* `cd todolist`
* `npm i`
* `npm run local`

更多详情请查看[官方文档](http://koa-cola.github.io/)

