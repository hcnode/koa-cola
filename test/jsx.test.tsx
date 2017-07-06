import * as React from 'react';
import * as should from 'should';
import { shallow, mount, render } from 'enzyme';
import Button from '../app_test/views/components/button'
import Cola from '../app_test/views/pages/cola'
import { initBrowser } from './util';



describe("#tsx component", function () {
    before(function (done) {
        initBrowser()
        done();
    });
    it("button", function () {
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