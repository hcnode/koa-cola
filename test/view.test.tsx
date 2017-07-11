import * as React from 'react';
import * as should from 'should';
import { shallow, mount, render } from 'enzyme';
import { initBrowser, chdir } from './util';
var { createProvider } = require('../dist');



describe("#tsx component", function () {
    before(function (done) {
        chdir();
        initBrowser()
        done();
    });

    after(function (done) {
        delete global.app;
        done();
    })
    it("button", function () {
        var click = false;

        var CustomButton = require(`${process.cwd()}/views/components/button`).default;
        var wrapper = mount(<CustomButton text="xxx" onClick={() => {
            click = true;
        }} />, { attachTo: document.getElementById('app') });

        wrapper.find('div button').node.innerHTML.should.be.equal('xxx')
        wrapper.find('div button').length.should.be.equal(1);
        wrapper.find('#isMounted').node.innerHTML.should.be.equal('true')
        wrapper.find('#isMounted2').node.innerHTML.should.be.equal('cola!')
        wrapper.find('div button').simulate('click')
        should(click).be.equal(true);
        wrapper.detach();
    });

});