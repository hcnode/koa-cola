import * as React from 'react';
var { asyncConnect, store } = require('koa-cola').Decorators.view;
var loadSuccess = store.loadSuccess;
export default asyncConnect([
  {
    key : 'hello',
    promise : () => {
      return Promise.resolve('Wow koa-cola!');
    }
  }
], null, dispatch => {
  return {
    onClick : () => {
      dispatch(loadSuccess('hello', 'Wow koa-cola again!'));
    }
  }
})(Index)
function Index({hello, onClick}){
  return <div>
    <h1>{ hello }</h1>
    <button onClick={onClick}>click me</button>
  </div>
}
