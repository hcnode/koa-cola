import { reqDir } from './require';
function _getEnvironment(){
	var IS_NODE_ENV_PRODUCTION = (process.env.NODE_ENV === 'production');
	return  IS_NODE_ENV_PRODUCTION ? 'production' 
		: (require('os').platform() == 'darwin' || require('os').platform() == 'win32') ? 'local' : 'develop'
}
function _getConfig(){
	var configs = reqDir(`${process.cwd()}/config`);
	var env = require(`${process.cwd()}/config/env/${_getEnvironment()}.js`);
	return Object.assign({}, Object.keys(configs).map(key => {
		
	}), env);
}


export const getEnvironment = _getEnvironment;
export const getConfig = _getConfig