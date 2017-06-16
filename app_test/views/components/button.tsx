import * as React from 'react';
export interface Props{
    text : string
    onClick : Function
}
export interface States {}

class Button extends React.Component<Props, States>   {
  constructor(props: Props) {
      super(props);
  }
  render() {
    return <div>
        <button onClick={() => {
          this.props.onClick()
          }}>{ this.props.text }</button>
      </div>
  }
};
export default Button