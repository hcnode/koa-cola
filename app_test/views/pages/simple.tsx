import * as React from 'react';
export interface Props{
    foo: string
}
export interface States {}
export const foo = 'this is foo';

class Page extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
      foo: foo
  };
  render() {
    return <div>
      <div><h2>koa-cola11</h2></div>
      <div id="foo">foo:{this.props.foo}</div>
    </div>
  }
};
export default Page