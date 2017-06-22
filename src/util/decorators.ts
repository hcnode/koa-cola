import * as controllerDecorators from 'controller-decorators';
import * as mongooseDecorators from 'mongoose-decorators';
import * as reduxConnect from 'redux-connect';
import { Reducer } from '../decorators/reducer';
export default {
	controller : controllerDecorators,
	model : mongooseDecorators,
	view : Object.assign(reduxConnect, {SyncReducer : Reducer}, {store : require('redux-connect/lib/store')})
}