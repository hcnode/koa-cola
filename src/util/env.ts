import { reqDir } from './require';
function _getEnvironment(){
	return  process.env.NODE_ENV ? process.env.NODE_ENV 
		: (require('os').platform() == 'darwin' || require('os').platform() == 'win32') ? 'local' : 'develop'
}
function _getConfig(){
	var configs = reqDir(`${process.cwd()}/config`);
	var env = require(`${process.cwd()}/config/env/${_getEnvironment()}.js`);
	return Object.assign({}, Object.keys(configs).reduce((config, key) => {
		return Object.assign(config, configs[key]);
	}, {}), env);
}


export const getEnvironment = _getEnvironment;
export const getConfig = _getConfig