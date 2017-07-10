"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const require_1 = require("./require");
const fs = require("fs");
function getEnvironment() {
    return process.env.NODE_ENV ? process.env.NODE_ENV
        : (require('os').platform() == 'darwin' || require('os').platform() == 'win32') ? 'local' : 'development';
}
exports.getEnvironment = getEnvironment;
function getConfig() {
    try {
        var configPath = `${process.cwd()}/config`;
        var envPath = `${process.cwd()}/config/env/${getEnvironment()}.js`;
        if (!fs.existsSync(configPath)) {
            return {};
        }
        var configs = require_1.reqDir(configPath);
        var defConfig = Object.keys(configs).reduce((config, key) => {
            return Object.assign(config, configs[key]);
        }, {});
        var env = {};
        if (fs.existsSync(envPath)) {
            env = require(envPath);
            Object.keys(env).forEach(key => {
                var isFunc = typeof env[key] == 'function';
                if (isFunc) {
                    env[key] = env[key](defConfig[key]);
                }
            });
        }
        return Object.assign({}, defConfig, env);
    }
    catch (err) {
        return {};
    }
}
exports.getConfig = getConfig;
