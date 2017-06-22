"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function page404({ error = '' }) {
    return React.createElement("div", null,
        "rendered from 404.tsx:",
        error);
}
exports.default = page404;
