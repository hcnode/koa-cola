import * as React from 'react';

export interface Props{
  ctrl? : {foo : string}
}
export interface States {}

class Page extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  render() {
    return <div>
      <div><h2>koa-cola</h2></div>
      {this.props.ctrl.foo}
    </div>
  }
};
export default Page