"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
exports.foo = 'this is foo';
class Page extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("h2", null, "koa-cola")),
            React.createElement("div", null,
                "foo:",
                this.props.foo));
    }
}
Page.defaultProps = {
    foo: exports.foo
};
;
exports.default = Page;
