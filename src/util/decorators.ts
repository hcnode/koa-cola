import * as controllerDecorators from 'controller-decorators';
// import * as mongooseDecorators from 'mongoose-decorators';
import * as reduxConnect from 'redux-connect';
try{
	var mongooseDecorators = require('mongoose-decorators');
}catch(e){}
export default {
	controller : controllerDecorators,
	model : mongooseDecorators,
	view : Object.assign(reduxConnect, {store : require('redux-connect/lib/store')})
}