"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 以下进行server端react router中间件
const React = require("react");
const server_1 = require("react-dom/server");
const react_router_1 = require("react-router");
var { ReduxAsyncConnect, loadOnServer, reducer } = require('redux-connect');
var createHistory = require('history').createMemoryHistory;
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const serialize = require("serialize-javascript");
const require_1 = require("../util/require");
exports.default = async (ctx, next) => {
    var routes = app.routers.router;
    var layout = require_1.req(`${process.cwd()}/views/pages/layout`);
    if (!routes) {
        console.log('${process.cwd()}/views/routers not found');
        return await next();
    }
    const store = redux_1.createStore(redux_1.combineReducers({ reduxAsyncConnect: reducer }));
    try {
        await new Promise((resolve, reject) => {
            react_router_1.match({ routes, location: ctx.url }, (err, redirect, renderProps) => {
                if (!renderProps)
                    return reject();
                // load data
                loadOnServer(Object.assign({}, renderProps, { store, helpers: { ctx } })).then(() => {
                    var { location } = renderProps;
                    /*if(location && location.query && location.query['event-cola']){
                        try {
                            var eventCola = JSON.parse(location.query['event-cola']);
                            const { JSDOM } = require('jsdom');
                            const jsdom = new JSDOM(``, {
                                url: ctx.url.replace(/event-cola=.+(&|$)/gi, ''),
                            });
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
                            // var wrapper = mount(page, { attachTo: document.getElementById('container') });
                            window.onload = function(){
                                if(eventCola.id && eventCola.event){
                                    ctx.session.eventColas = ctx.session.eventColas || {};
                                    var eventColas = ctx.session.eventColas[location.pathname] = ctx.session.eventColas[location.pathname] || []
                                    eventColas.push(eventCola);
                                    eventColas.forEach(cola => {
                                        // wrapper.find('#' + eventCola.id).simulate(cola.event)
                                        event = document.createEvent("HTMLEvents");
                                        event.initEvent(cola.event, true, true);
                                        document.getElementById(cola.id).dispatchEvent(event);
                                    });
                                }
                                // var html = document.getElementById('container').innerHTML
                                ctx.body = document.getElementById('container').innerHTML;
                                resolve();
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    }else{*/
                    var appHTML = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store, key: "provider" },
                        React.createElement(ReduxAsyncConnect, Object.assign({}, renderProps))));
                    if (layout) {
                        appHTML = layout(appHTML, store);
                    }
                    else {
                        console.log(`${process.cwd()}/views/pages/layout nor found`);
                    }
                    // var prefix = app.config.prefix || '';
                    // var staticPath = app.config.staticPath;
                    // var publicPath = process.cwd() + '/public';
                    var injectHtml = `
							<!-- its a Redux initial data -->
							<script>
								window.__data=${serialize(store.getState())};
							</script>
							</html>
						`;
                    // <script src="${process.env.NODE_ENV == 'production' && staticPath ? staticPath : prefix}/bundle.js"></script>
                    if (/<\/html\>/ig.test(appHTML)) {
                        appHTML = appHTML.replace(/<\/html\>/ig, injectHtml);
                    }
                    else {
                        appHTML += injectHtml;
                    }
                    ctx.body = appHTML;
                    resolve();
                    // }
                });
            });
        });
    }
    catch (error) {
        await next();
    }
};
