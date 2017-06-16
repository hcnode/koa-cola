import * as React from 'react';
const { JSDOM } = require('jsdom');
export function renderCola(html) {
    const jsdom = new JSDOM(html);
    return jsdom;
}
export function actionCola(jsdom){
    jsdom = jsdom || new JSDOM(`<!doctype html><html><body></body></html>`);
    const { window } = jsdom;
    // function copyProps(src, target) {
    //     const props = Object.getOwnPropertyNames(src)
    //         .filter(prop => typeof target[prop] === 'undefined')
    //         .map(prop => Object.getOwnPropertyDescriptor(src, prop));
    //     Object.defineProperties(target, props);
    // }

    global.window = window;
    global.document = window.document;
    global.navigator = {
        userAgent: 'node.js'
    };
    return jsdom;
    // copyProps(window, global);
}