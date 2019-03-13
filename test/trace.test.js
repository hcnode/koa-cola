require('@google-cloud/trace-agent').start({
    projectId: 'kinetic-bot-231610',
    keyFilename: '../../gdc-trace.json'
});

async function run() {
    var mongoose = require('mongoose');
    await mongoose.connect('mongodb://127.0.0.1:27017/koa-cola');
    var User = mongoose.model('user', new mongoose.Schema({
        name: {
            type : String
        },
        email : {
            type : String
        }
    }))

    var data = await new User({ name: 'Harry'}).save();;
    console.log(data)
}
run();