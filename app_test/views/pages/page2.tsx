import * as React from 'react';
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
var loadSuccess = require('redux-connect/lib/store').loadSuccess;
export interface Props{
    foo: string
    bar: string
    onClick : any
    onAsyncClick : any
}
export interface States {}

export const foo = 'this is foo';
export const foo2 = 'this is foo again';
export const bar = 'this is bar';
export const bar2 = 'this is bar again';
export const timeout = 500;
@asyncConnect([{
  key: 'bar',
  promise: ({ params, helpers }) => new Promise((resolve, reject) => {
      setTimeout(() => resolve(bar), timeout)
  })
}], ({ foo }) => {
  return {
    foo
  }
}, (dispatch) => {
  return {
    onClick: () => {
      dispatch({type : 'click'});
    },
    onAsyncClick: async () => {
      var data = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(bar2), timeout)
      })
      dispatch(loadSuccess('bar', data));
    }
  }
})
class App extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
      foo: foo,
      bar: ''
  };
  render() {
    return <div>
      <div>this is rendered from page2.tsx</div>
      <div id="foo">{this.props.foo}</div>
      <div id="bar">{this.props.bar}</div>
      <button id="btn1" onClick={() => {
        this.props.onAsyncClick();
      }}>test async</button>
      <button id="btn2" onClick={() => {
        this.props.onClick();
      }}>click</button>
    </div>
  }
};

// 定义getReducer方法
export function getReducer(){
  return {
    foo: (state = 0, action) => {
      if(action.type == 'click') return foo2;
      else return state;
    }
  }
}
export default App