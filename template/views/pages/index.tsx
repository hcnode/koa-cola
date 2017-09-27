import * as React from 'react';
var { Cola, store } = require('koa-cola/client');
var loadSuccess = store.loadSuccess;
// 这里没有使用decorator的方式export组件，是因为组件使用的stateless的方式，只有使用class的方式才能使用decorator
export default Cola({
  initData : {
    hello : () => {
      return Promise.resolve('Wow koa-cola!');
    }
  },
  mapDispatchToProps : dispatch => {
    return {
      onClick : () => {
        dispatch(loadSuccess('hello', 'Wow koa-cola and bundle work!'));
      }
    }
  }
})(Index)

function Index({hello, onClick}){
  return <div>
    <h1>{ hello }</h1>
    <button onClick={onClick}>check bundle if work</button>
  </div>
}
