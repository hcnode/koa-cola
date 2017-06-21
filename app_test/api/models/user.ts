// import {model, index, post, pre} from 'mongoose-decorators';
var { model, index, post, pre } = app.decorators.model;
class Model {
    name : string
    email : string
}
@model({
  name: {
      type : String
  },
  email : {
      type : String
  }
})
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