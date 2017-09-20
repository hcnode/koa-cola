import * as React from 'react';
var {
  header, bundle, doNotUseLayout
} = require("../../../client")
export interface Props{
    foo: string
}
export interface States {}
export const foo = 'this is foo';

@doNotUseLayout
@bundle([
  "/bundle.js",
  "/test.js"
])
@header(() => {
  return <head>
    <meta name="viewport" content="width=device-width" />
  </head>
})
class Page extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
      foo: foo
  };
  render() {
    return <div>
      <div><h2>koa-cola</h2></div>
      <div id="foo">foo:{this.props.foo}</div>
    </div>
  }
};
export default Page