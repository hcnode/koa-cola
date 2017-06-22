"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
const request = require("supertest-as-promised");
// var request = require("supertest-as-promised");
describe('#koa-cola', function () {
    var koaApp, mongoose;
    before(function (done) {
        process.chdir('./app_test');
        koaApp = require('../src/index').default;
        mongoose = app.mongoose;
        var Mockgoose = require('mockgoose').Mockgoose;
        var mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage().then(function () {
            global.app.mongoose.connect('mongodb://127.0.0.1:27017/koa-cola', function (err) {
                done(err);
            });
        });
    });
    after(function (done) {
        mongoose.disconnect(done);
    });
    describe('#middleware', function () {
        it('#requestTime', async function () {
            var res = await request(koaApp)
                .get('/testMiddleware')
                .expect(200)
                .toPromise();
            should(res.text).match(/requestTime:\d*/);
        });
        it('#checkMiddlewareOrder', async function () {
            var res = await request(koaApp)
                .get('/checkMiddlewareOrder')
                .expect(200)
                .toPromise();
            should(res.text).be.equal(['checkMiddlewareOrder', 'requestTime'].join('-'));
        });
        it('#disabledMiddleware', async function () {
            var res = await request(koaApp)
                .get('/disabledMiddleware')
                .expect(404)
                .toPromise();
        });
    });
});
