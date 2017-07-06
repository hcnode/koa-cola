export function chdir() {
    if (process.cwd().indexOf('app_test') == -1) {
        process.chdir('./app_test');
    }
}
export function initBrowser() {
    const { JSDOM } = require('jsdom');
    const jsdom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>');
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
export function loadScript(code) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML = code;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}