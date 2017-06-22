"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const should = require("should");
// require('should')
const enzyme_1 = require("enzyme");
const button_1 = require("../app_test/views/components/button");
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
describe("#tsx component", function () {
    before(function (done) {
        // require('babel-register')();
        initBrowser();
        done();
    });
    it("button", function () {
        var click = false;
        var wrapper = enzyme_1.mount(React.createElement(button_1.default, { text: "xxx", onClick: () => {
                click = true;
            } }), { attachTo: document.getElementById('container') });
        wrapper.find('div button').node.innerHTML.should.be.equal('xxx');
        wrapper.find('div button').length.should.be.equal(1);
        wrapper.find('#isMounted').node.innerHTML.should.be.equal('true');
        wrapper.find('#isMounted2').node.innerHTML.should.be.equal('cola!');
        wrapper.find('div button').simulate('click');
        should(click).be.equal(true);
        wrapper.detach();
    });
});
