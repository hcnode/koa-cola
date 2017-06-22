"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as mongoose from 'mongoose'
var User = app.mongoose.model('User');
class default_1 {
    hi() {
        return app.services.TestService.sayHi();
    }
}
exports.default = default_1;
