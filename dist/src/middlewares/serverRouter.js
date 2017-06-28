"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

Object.defineProperty(exports, "__esModule", { value: true });
// 以下进行server端react router中间件
var React = require("react");
var server_1 = require("react-dom/server");
var react_router_1 = require("react-router");

var _require = require('redux-connect'),
    ReduxAsyncConnect = _require.ReduxAsyncConnect,
    loadOnServer = _require.loadOnServer,
    reducer = _require.reducer;

var createHistory = require('history').createMemoryHistory;
var react_redux_1 = require("react-redux");
var redux_1 = require("redux");
var serialize = require("serialize-javascript");
var require_1 = require("../util/require");
exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var routes, layout, store;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        routes = require_1.req(process.cwd() + "/views/routers");
                        layout = require_1.req(process.cwd() + "/views/pages/layout");
                        store = redux_1.createStore(redux_1.combineReducers({ reduxAsyncConnect: reducer }));
                        _context.prev = 3;
                        _context.next = 6;
                        return new Promise(function (resolve, reject) {
                            react_router_1.match({ routes: routes, location: ctx.url }, function (err, redirect, renderProps) {
                                if (!renderProps) return reject();
                                // load data
                                loadOnServer(Object.assign({}, renderProps, { store: store, helpers: { ctx: ctx } })).then(function () {
                                    var location = renderProps.location;
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

                                    var appHTML = server_1.renderToString(React.createElement(react_redux_1.Provider, { store: store, key: "provider" }, React.createElement(ReduxAsyncConnect, Object.assign({}, renderProps))));
                                    var html = layout(appHTML, store);
                                    var prefix = app.config.prefix || '';
                                    var injectHtml = "\n\t\t\t\t\t\t\t<!-- its a Redux initial data -->\n\t\t\t\t\t\t\t<script>\n\t\t\t\t\t\t\t\twindow.__data=" + serialize(store.getState()) + ";\n\t\t\t\t\t\t\t</script>\n\t\t\t\t\t\t\t<script src=\"" + prefix + "/bundle.js\"></script>\n\t\t\t\t\t\t\t</html>\n\t\t\t\t\t\t";
                                    if (/<\/html\>/ig.test(html)) {
                                        html = html.replace(/<\/html\>/ig, injectHtml);
                                    } else {
                                        html += injectHtml;
                                    }
                                    ctx.body = html;
                                    resolve();
                                    // }
                                });
                            });
                        });

                    case 6:
                        _context.next = 12;
                        break;

                    case 8:
                        _context.prev = 8;
                        _context.t0 = _context["catch"](3);
                        _context.next = 12;
                        return next();

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[3, 8]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();