// import {model, index, post, pre} from 'mongoose-decorators';
import { todoListSchema } from '../schemas/todoList';

var { model } = app.decorators.model;

@model(todoListSchema(app.mongoose))
export default class User{
  
}