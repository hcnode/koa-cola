/**
 * react page 组件
 * 使用redux-connect的注解使react组件变成react-redux，并在此基础上封装了服务器端异步connect
 * 
 * react-redux教程
 * http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_three_react-redux.html
 */

import * as React from 'react';
import { Compose, ServerCallApi } from '../../api';
var { ReduxAsyncConnect, asyncConnect, reducer, store, SyncReducer  } = require('../../../').Decorators.view;
var loadSuccess = store.loadSuccess;
export interface Props{
    pepsi?: string
    coca?: string
    onClick? : any
    onAsyncClick? : any
    ajax? : any
    serverCallResult? : string
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
  key: 'pepsi',
  promise: ({ params, helpers }) => {
    return Promise.resolve(pepsi);
  }
},{
  key: 'coca',
  promise: ({ params, helpers }) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(coca), timeout)
    })
  }
},{
  key: 'serverCallResult',
  promise: async ({ params, helpers }) => {
    var ctx = helpers.ctx;
    var serverCallApi = new ServerCallApi({});
    var data = await serverCallApi.fetch(ctx);
    return data.result;
  }
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
      dispatch(loadSuccess('pepsi', pepsi2));
    },
    onAsyncClick: async () => {
      var data = await new Promise((resolve, reject) => {
        setTimeout(() => resolve(coca2), timeout)
      })
      dispatch(loadSuccess('coca', data));
    },
    ajax : async () => {
      var compose = new Compose({foo : 'bar'})
      compose = await compose.fetch();
      console.log(compose);
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
  componentDidMount() {
  }
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
      <button id="btn4" onClick={() => {
        this.props.ajax()
      }}>serverCall</button>
      <div id="dataFromServer">{this.props.serverCallResult}</div>
    </div>
    return result;
  }
};

export default App