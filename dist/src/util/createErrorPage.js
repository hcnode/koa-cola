"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var server_1 = require("react-dom/server");
function createErrorPage(_ref) {
    var env = _ref.env,
        ctx = _ref.ctx,
        error = _ref.error,
        stack = _ref.stack,
        _ref$status = _ref.status,
        status = _ref$status === undefined ? 500 : _ref$status,
        _ref$code = _ref.code,
        code = _ref$code === undefined ? 500 : _ref$code;

    // some errors will have .status
    // however this is not a guarantee
    ctx.status = status || 500;
    ctx.type = 'html';
    try {
        var ErrorPage = require(process.cwd() + "/views/pages/" + status).default;
        ctx.body = server_1.renderToString(React.createElement(ErrorPage, Object.assign({}, arguments[0])));
    } catch (err) {
        ctx.body = "\n            <p>" + error + "</p>\n            <p>" + stack + "</p>\n        ";
    }
}
exports.default = createErrorPage;