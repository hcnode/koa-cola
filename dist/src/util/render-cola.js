"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { JSDOM } = require('jsdom');
function setDom(html) {
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
exports.default = setDom;
//# sourceMappingURL=render-cola.js.map