"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var winston = require("winston");
var winston_daily_rotate_file = require("winston-daily-rotate-file");
var logPath = process.cwd() + '/logs/';
var path = require('path');
require('fs-extra').ensureDirSync(logPath);
var logger = new winston.Logger({
    transports: [new winston_daily_rotate_file({
        name: 'info-file',
        filename: path.join(logPath, 'info.log'),
        datePattern: '.yyyy-MM-dd',
        level: 'info'
    }), new winston_daily_rotate_file({
        name: 'error-file',
        filename: path.join(logPath, 'error.log'),
        datePattern: '.yyyy-MM-dd',
        level: 'error'
    })]
});
exports.default = logger;