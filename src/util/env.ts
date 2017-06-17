import { reqDir } from './require';
function _getEnvironment(){
	return  process.env.NODE_ENV ? process.env.NODE_ENV 
		: (require('os').platform() == 'darwin' || require('os').platform() == 'win32') ? 'local' : 'develop'
}
function _getConfig(){
	var configs = reqDir(`${process.cwd()}/config`);
	var defConfig = Object.keys(configs).reduce((config, key) => {
		return Object.assign(config, configs[key]);
	}, {});
	var env = require(`${process.cwd()}/config/env/${_getEnvironment()}.js`);
	Object.keys(env).forEach(key => {
		var isFunc = typeof env[key] == 'function';
		if(isFunc){
			env[key] = env[key](defConfig[key]);
		}
	})
	return Object.assign({}, defConfig, env);
}


export const getEnvironment = _getEnvironment;
export const getConfig = _getConfig