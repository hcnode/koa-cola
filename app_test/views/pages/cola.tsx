/**
 * react page 组件
 * 使用redux-connect的注解使react组件变成react-redux，并在此基础上封装了服务器端异步connect
 * 
 * react-redux教程
 * http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html
 */

import * as React from 'react';
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-connect'
// import { EventCola } from '../../../src/decorators/event-cola';
import { Reducer } from '../../../src/decorators/reducer';
var loadSuccess = require('redux-connect/lib/store').loadSuccess;
export interface Props{
    pepsi?: string
    coca?: string
    onClick? : any
    onAsyncClick? : any
}
export interface States {
  cola? : string
}

export const pepsi = 'this is pepsi-cola';
export const pepsi2 = 'this is pepsi-cola again';
export const coca = 'this is coca-cola';
export const coca2 = 'this is coca-cola again';
export const timeout = 500;
@asyncConnect([{
  key: 'coca',
  promise: ({ params, helpers }) => new Promise((resolve, reject) => {
      setTimeout(() => resolve(coca), timeout)
  })
}], 
// mapStateToProps
({ pepsi }) => {
  return {
    pepsi
  }
}, 
// mapDispatchToProps
(dispatch) => {
  return {
    onClick: () => {
      dispatch({type : 'click'});
    },
    onAsyncClick: async () => {
      var data = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(coca2), timeout)
      })
      dispatch(loadSuccess('coca', data));
    }
  }
})
// reducer
@Reducer(() => {
  return {
    pepsi: (state = pepsi, action) => {
      if(action.type == 'click') return pepsi2;
      else return state;
    }
  }
})
class App extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
      this.state = {
        cola : ''
      }
  }
  static defaultProps = {
      pepsi: pepsi,
      coca: ''
  };
  render() {
    var result =  <div>
      <div><h2>koa-cola</h2></div>
      <div id="pepsi">{this.props.pepsi}</div>
      <div id="coca">{this.props.coca}</div>
      <div id="cola">{this.state.cola}</div>
      <button id="btn1" onClick={() => {
        this.props.onAsyncClick();
      }}>test async</button>
      <button id="btn2" onClick={() => {
        this.props.onClick();
      }}>click</button>
      <button id="btn3" onClick={() => {
        this.setState({cola : 'wow'});
      }}>setState</button>
      
    </div>
    return result;
  }
};

export default App