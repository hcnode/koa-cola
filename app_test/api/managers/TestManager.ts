var User = app.mongoose.model('User');
export default class {
    hi() {
        return app.services.TestService.sayHi();
    }
    async createUser() {
        return await User.create({name : 'Harry', email : 'hcnode@gmail.com'});
    }

    async findHarry() {
        return await User.findOne({name : 'Harry'});
    }
}