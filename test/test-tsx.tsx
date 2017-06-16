import * as React from 'react';
import * as should from 'should';
// require('should')
import { shallow, mount, render } from 'enzyme';

function initBrowser() {
    const { JSDOM } = require('jsdom');
    const jsdom = new JSDOM('<!doctype html><html><body><div id="container"></div></body></html>');
    const { window } = jsdom;

    function copyProps(src, target) {
        const props = Object.getOwnPropertyNames(src)
            .filter(prop => typeof target[prop] === 'undefined')
            .forEach(prop => {
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(src, prop));
            });
    }

    global.window = window;
    global.document = window.document;
    global.navigator = {
        userAgent: 'node.js'
    };
    copyProps(window, global);
}
interface Props {
    text: string
    onClick: Function
}
interface States {
    isMounted?: boolean
}
class Button extends React.Component<Props, States>   {
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
describe("#tsx component", function () {
    before(function (done) {
        // require('babel-register')();
        initBrowser()
        done();
    });
    it("contains spec with an expectation", function () {
        var click = false;
        var wrapper = mount(<Button text="xxx" onClick={() => {
            click = true;
        }} />, { attachTo: document.getElementById('container') });

        wrapper.find('div button').node.innerHTML.should.be.equal('xxx')
        wrapper.find('div button').length.should.be.equal(1);
        wrapper.find('#isMounted').node.innerHTML.should.be.equal('true')
        wrapper.find('#isMounted2').node.innerHTML.should.be.equal('cola!')
        wrapper.find('div button').simulate('click')
        should(click).be.equal(true);
        wrapper.detach();
    });
});