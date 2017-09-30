"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const server_1 = require("react-dom/server");
const require_1 = require("../util/require");
var { ReduxAsyncConnect, loadOnServer, reducer } = require('redux-connect');
const layoutWrapper_1 = require("../middlewares/layoutWrapper");
async function createErrorPage({ env, ctx, error, stack, status = 500, code = 500 }) {
    // some errors will have .status
    // however this is not a guarantee
    ctx.status = status || 500;
    ctx.type = 'html';
    // 如果定义了错误对应的page，则使用page来渲染
    var ErrorPage = app.pages[status];
    if (ErrorPage) {
        const store = redux_1.createStore(redux_1.combineReducers(Object.assign({ reduxAsyncConnect: reducer })));
        var childrenComponents = ErrorPage.childrenComponents || {};
        var components = [
            '',
            ErrorPage,
            ...Object.keys(childrenComponents).map(key => childrenComponents[key])
        ];
        await loadOnServer({ components, store, helpers: { ctx } });
        var layout = require_1.req(`${process.cwd()}/views/pages/layout`);
        var appHTML = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
            React.createElement(ErrorPage, Object.assign({}, arguments[0]))));
        appHTML = await layoutWrapper_1.default(appHTML, components[1], layout, store, { components }, ctx);
        // var {_doNotUseLayout, Header, _bundle, _pagePros = {}} = ErrorPage;
        // if(_doNotUseLayout){
        //     appHTML = `
        //         <!doctype html>
        //         <html>
        //             ${Header ? renderToString(<Header />) : ''}
        //             <body><div>${appHTML}</div></body>
        //             <script>
        //                 window.__data=${serialize(store.getState())};
        //             </script>
        //             ${_bundle ? _bundle.map(item => {
        //                 return `<script src='${item}'></script>`
        //             }) : ''}
        //         </html>
        //             `
        // }else{
        //     /**
        //      * 必须配置layout，并且必须在layout引用bundle文件
        //      * 浏览器端的react-redux所需要的文件由下面的injectHtml自动插入
        //      */
        //     if (layout) {
        //         appHTML = layout(appHTML, store, {components}, typeof _pagePros == 'function' ? await _pagePros(ctx) : _pagePros);
        //     } else {
        //         console.log(`${process.cwd()}/views/pages/layout not found`)
        //     }
        //     var injectHtml = `
        //             <!-- its a Redux initial data -->
        //             <script>
        //                 window.__data=${serialize(store.getState())};
        //             </script>
        //             </html>
        //         `;
        //     if (/<\/html\>/ig.test(appHTML)) {
        //         appHTML = appHTML.replace(/<\/html\>/ig, injectHtml)
        //     } else {
        //         appHTML += injectHtml
        //     }
        // }
        ctx.body = appHTML;
    }
    else {
        // production ignore error stack
        if (process.env.NODE_ENV == 'production') {
            ctx.body = error;
        }
        else {
            ctx.body = `
                <p>${error}</p>
                <p>${stack}</p>
            `;
        }
    }
}
exports.default = createErrorPage;
