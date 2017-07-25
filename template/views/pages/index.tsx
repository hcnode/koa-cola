import * as React from 'react';
export interface Props{
    
}
export interface States {}

class Index extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
      
  };
  render() {
    return <h1>Wow koa-cola!</h1>
  }
};
export default Index