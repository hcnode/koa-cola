// import {model, index, post, pre} from 'mongoose-decorators';
import { userSchema } from '../schemas/user';

var { model, index, post, pre } = app.decorators.model;
class Model {
    name : string
    email : string
}
@model(userSchema(app.mongoose))
export default class User extends Model {
  // class methods
  check() {
      return this.name && this.email
  }

  @pre('save')
  preSave(next) {
      if(!this.check()){
        next(new Error('400'))
      }else{
        next()
      }
  }
}