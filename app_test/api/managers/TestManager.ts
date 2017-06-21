// import * as mongoose from 'mongoose'
var User = app.mongoose.model('User');
export default class {
    hi() {
        return app.services.TestService.sayHi();
    }
}