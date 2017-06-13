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
      <div>this is rendered from page1.tsx</div>
      <div>foo:{this.props.foo}</div>
    </div>
  }
};
export default Page