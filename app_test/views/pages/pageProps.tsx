import * as React from 'react';
var {
  pageProps
} = require("../../../dist/client").Decorators.view;
export interface Props{}
export interface States {}
@pageProps(ctx => {
  return Promise.resolve({
    title : ctx.query.title
  })
})
class Page extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
  };
  render() {
    return <div>
    </div>
  }
};
export default Page