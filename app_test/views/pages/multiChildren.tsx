/**
 */

import * as React from 'react';
import { Compose, ServerCallApi } from '../../api';

var {
  ReduxAsyncConnect,
  asyncConnect,
  reducer,
  store,
  colaReducer,
  include
} = require('../../../client').Decorators.view;
var loadSuccess = store.loadSuccess;
var Child1 = require('../components/child1').default;
var Child2 = require('../components/child2').default;

export interface Props {
  prop1?: any;
  prop2?: any;
  propClick?: any;
  Child1?: any;
  Child2?: any;
}
export interface States {}

@asyncConnect([
  {
    key: 'prop1',
    promise: ({ params, helpers }) => {
      return '';
    }
  },
  {
    key: 'prop2',
    promise: ({ params, helpers }) => {
      return '';
    }
  },
  {
    key: 'propClick',
    promise: ({ params, helpers }) => {
      return '';
    }
  }
])
@include({
  Child1,
  Child2
})
class MultiChildren extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    var result = (
      <div>
        <div
          style={{ border: 'blue solid 1px', padding: '3px', margin: '5px' }}
        >
          <h3>parent</h3>
          {this.props.prop1} - {this.props.prop2} - {this.props.propClick}
        </div>
        {this.props.Child1}
        <Child2 {...this.props} />
        <Child2 {...this.props} />
      </div>
    );
    return result;
  }
}

export default MultiChildren;
