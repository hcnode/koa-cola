import * as React from 'react';
export interface Props{
    
}
export interface States {}

class Login extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  static defaultProps = {
      
  };
  render() {
    return <div>
      <form action="/login" method="post">
        name: &nbsp;<input type="text" name="name"/><br/>
        email: &nbsp;<input type="text" name="email"/><br/>
        &nbsp;<input type="submit" value="login"/>
      </form>
    </div>
  }
};
export default Login