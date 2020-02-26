"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const server_1 = require("react-dom/server");
const stringfy_1 = require("../util/stringfy");
exports.default = async (html, component, layout, store, ctx) => {
    var __data = '{}';
    try {
        __data = stringfy_1.default(store.getState());
    }
    catch (error) { }
    var { _doNotUseLayout, Header, _bundle, _pagePros = {} } = component;
    if (_doNotUseLayout) {
        html = `
            <!doctype html>
            <html>
                ${Header ? server_1.renderToString(React.createElement(Header, null)) : ""}
                <body><div>${html}</div></body>
                <script>
                    window.__data=${__data};
                </script>
                ${_bundle
            ? _bundle.map(item => {
                return `<script src='${item}'></script>`;
            })
            : ""}
            </html>
                `;
    }
    else {
        /**
             * 必须配置layout，并且必须在layout引用bundle文件
             * 浏览器端的react-redux所需要的文件由下面的injectHtml自动插入
             */
        if (layout) {
            html = layout(html, store, component, typeof _pagePros == "function" ? await _pagePros(ctx) : _pagePros);
        }
        else {
            console.log(`${process.cwd()}/views/pages/layout not found`);
        }
        var injectHtml = `
                <!-- its a Redux initial data -->
                <script>
                    window.__data=${__data};
                </script>
                
            `;
        if (/<\/html\>/gi.test(html)) {
            html = html.replace(/<\/html\>/gi, injectHtml + '</html>');
        }
        else {
            html += injectHtml;
        }
    }
    return html;
};
//# sourceMappingURL=layoutWrapper.js.map