/**
 * 获取当前环境，和当前配置
 */
import { reqDir } from './require';
import * as fs from 'fs'
export function getEnvironment() {
	return process.env.NODE_ENV ? process.env.NODE_ENV
		: (require('os').platform() == 'darwin' || require('os').platform() == 'win32') ? 'local' : 'development'
}
export function getConfig() {
	try {
		// config目录下的配置，可视为通用的配置
		// config/env/环境/ 下的配置，将覆盖通用的配置
		var configPath = `${process.cwd()}/config`;
		var envPath = `${process.cwd()}/config/env/${getEnvironment()}.js`;
		if (!fs.existsSync(configPath)) {
			return {};
		}
		var configs = reqDir(configPath);
		var defConfig = Object.keys(configs).reduce((config, key) => {
			return Object.assign(config, configs[key]);
		}, {});
		var env = {};
		if (fs.existsSync(envPath)) {
			env = require(envPath);
			Object.keys(env).forEach(key => {
				var isFunc = typeof env[key] == 'function';
				// 如果有key是function
				if (isFunc) {
					env[key] = env[key](defConfig[key]);
				}
			})
		}
		return Object.assign({}, defConfig, env);
	} catch (err) {
		return {};
	}
}

