"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Button extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMounted: false
        };
    }
    componentDidMount() {
        this.setState({ isMounted: true });
        document.getElementById('isMounted2').innerHTML = 'cola!';
    }
    render() {
        return React.createElement("div", null,
            React.createElement("button", { onClick: () => {
                    this.props.onClick();
                } }, this.props.text),
            React.createElement("div", { id: "isMounted" }, this.state.isMounted ? 'true' : 'false'),
            React.createElement("div", { id: "isMounted2" }));
    }
}
;
exports.default = Button;
