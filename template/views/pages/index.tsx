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