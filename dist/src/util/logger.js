"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const winston_daily_rotate_file = require("winston-daily-rotate-file");
const logPath = process.cwd() + '/logs/';
const path = require('path');
require('fs-extra').ensureDirSync(logPath);
var logger = new (winston.Logger)({
    transports: [
        new (winston_daily_rotate_file)({
            name: 'info-file',
            filename: path.join(logPath, 'info.log'),
            datePattern: '.yyyy-MM-dd',
            level: 'info'
        }),
        new (winston_daily_rotate_file)({
            name: 'error-file',
            filename: path.join(logPath, 'error.log'),
            datePattern: '.yyyy-MM-dd',
            level: 'error'
        })
    ]
});
exports.default = logger;
//# sourceMappingURL=logger.js.map