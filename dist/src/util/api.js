"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fetch = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(api, ctx) {
        var url, method, body, req, cookie, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        url = api.url, method = api.method, body = api.body;
                        // var args : any = [api.url];

                        req = {
                            url: url,
                            method: method
                        };

                        if (api.method.toLowerCase() == 'post') {
                            req.data = body;
                        } else {
                            if (Object.keys(api.body).length > 0) {
                                req.url += (req.url.indexOf('?') == -1 ? '?' : '&') + Object.keys(api.body).map(function (field) {
                                    return field + "=" + api.body[field];
                                }).join('&');
                            }
                        }
                        if (ctx) {
                            req.url = "http://127.0.0.1:" + app.config.port + req.url;
                            cookie = ctx.req.headers.cookie;

                            if (cookie) {
                                req.headers = {
                                    Cookie: cookie
                                };
                            }
                        }
                        _context.next = 6;
                        return axios_1.default(req);

                    case 6:
                        result = _context.sent;

                        api.result = result.data;
                        return _context.abrupt("return", api);

                    case 9:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function _fetch(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");

var Base = function () {
    function Base(body) {
        _classCallCheck(this, Base);

        this.url = '';
        this.method = 'get';
        this.body = body;
    }

    _createClass(Base, [{
        key: "fetch",
        value: function fetch(ctx) {
            return _fetch(this, ctx);
        }
    }]);

    return Base;
}();

exports.Base = Base;

exports.fetch = _fetch;