import * as React from 'react';
import { Compose, ServerCallApi } from '../../api';
import { Cola, store } from '../../../client';
import Child1 from './child1'
var loadSuccess = store.loadSuccess;
export interface Props {
  prop1?: any
  prop2?: any
  propClick?:any
  Child1?:any
}
export interface States {
}

@Cola({
  initData : {
    prop2 : ({ params, helpers }) => {
      return Promise.resolve('prop2');
    },
    propClick : ({ params, helpers }) => {
      return '';
    }
  }
})
export default class Child2 extends React.Component<Props, States>   {
  constructor(props: Props) {
    super(props);
  }
  componentDidMount() {
  }
  render() {
    var result = <div style={{border:"blue solid 1px", padding : '3px', margin : "5px"}}>
      <h3>child2</h3>
      {this.props.prop2} - {this.props.propClick}
        <Child1 {...this.props} />
    </div>
    return result;
  }
};