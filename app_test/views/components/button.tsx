import * as React from 'react';
interface Props {
    text: string
    onClick: Function
}
interface States {
    isMounted?: boolean
}
class CustomButton extends React.Component<Props, States>   {
    constructor(props: Props) {
        super(props);
        this.state = {
            isMounted: false
        };
    }

    componentDidMount() {
        this.setState({ isMounted: true });
        document.getElementById('isMounted2').innerHTML = 'cola!'
    }
    render() {
        return <div>
            <button onClick={() => {
                this.props.onClick()
            }}>{this.props.text}</button>
            <div id="isMounted">{this.state.isMounted ? 'true' : 'false'}</div>
            <div id="isMounted2"></div>
        </div>
    }
};

export default CustomButton