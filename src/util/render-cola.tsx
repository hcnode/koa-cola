import * as React from 'react';
const { JSDOM } = require('jsdom');
export default function setDom(html) {
    const jsdom = new JSDOM(html);
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
    return jsdom;
}