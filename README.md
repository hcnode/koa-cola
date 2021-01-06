
# koa-cola
[![Build Status](https://travis-ci.org/hcnode/koa-cola.svg?branch=master)](https://travis-ci.org/hcnode/koa-cola)
[![Coverage Status](https://coveralls.io/repos/github/hcnode/koa-cola/badge.svg?branch=master)](https://coveralls.io/github/hcnode/koa-cola?branch=master)
[![npm](https://img.shields.io/npm/v/koa-cola.svg)](https://www.npmjs.com/package/koa-cola)

[中文版readme](https://github.com/hcnode/koa-cola/blob/master/README_zh.md)

[koa-cola](https://koa-cola.github.io/) is SSR(server side render) and SPA(single page application) integrated solution framework using koa/react/react-router/redux/typescript, and using and "isomorphic" codes in many modules(component/router/redux/validation used in both browser and server side).


### Features
* Built in SSR and SPA integrated solution
* "Isomorphic" component/router/redux/ajax/validation in both client and server side
* Typescript and ES7 decorator coding style


## Usage

> Koa requires node v7.6.0 or higher for ES2015 and async function support.

koa-cola requires node v7.6.0 or higher as well. Node.js 8.0 comes with significantly improved performance of async/await, so node.js 8.0 or higher is recommended. 

* `npm i koa-cola -g` install global koa-cola cli.
* `koa-cola new koa-cola-app` create new koa-cola project in current folder.
* `cd koa-cola-app`
* `npm run dev` start dev mode to build bundle and launch server.

Here is `Cola` decorator example to demonstrate what does it look like writing "Isomorphic" codes in Koa-cola:

```tsx
import * as React from "react";
import { Cola, store } from "koa-cola/client";
import { GetFooApi } from "../../api";
var loadSuccess = store.loadSuccess;
// Api can be called either in browser or node.js, in server side, ctx parameter exists.
async function callApi(ctx?) {
  var getFooApi = new GetFooApi({});
  await getFooApi.fetch(ctx);
  var result: any = getFooApi.result;
  return `api called from ${ctx ? "server" : "client"}, data:${result.data}`;
}
// Use Cola decorator to "isomorphic" redux data flow
@Cola({
  // In SSR mode:
  // return some props in initData in server side and as the init state in client side redux
  // in client side, ssr component html "rendered" with the init state, so this looks like redux state flows from server side to client side
  
  // In SPA mode:
  // when visit the component without refreshing page like click react-router <link>, props in initData is run only in client side
  // So redux state only flows in client side
  initData: {
    hello: () => {
      return Promise.resolve("Wow koa-cola!");
    },
    // this callApi called is in server side in SSR mode
    // or in client side in SPA mode
    apiDataCallFromServer: async ({ params, helpers }) => {
      return await callApi(helpers.ctx);
    }
  },
  // react-redux "mapDispatchToProps"
  mapDispatchToProps: dispatch => {
    return {
      // update hello props 
      onClick: () => {
        dispatch(loadSuccess("hello", "Wow koa-cola and bundle work!"));
      },
      // this callApi called is in browser side
      callApiFromClient: async () => {
        var data = await callApi();
        dispatch({
          type: "CALL_API",
          data
        });
      },
      // use redux-thunk middlewares, defined in /config/reduxMiddlewares.js
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
  // react-redux "mapStateToProps" can be used as the props selector
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
export default class App extends React.Component {
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


Try TODO-LIST demo in local:

* `git clone https://github.com/koa-cola/todolist`
* `cd todolist`
* `npm i`
* `npm run local`


Visit [koa-cola website](https://koa-cola.github.io/) for detail document.
