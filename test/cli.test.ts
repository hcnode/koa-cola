require('should')
import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import * as fs from 'fs'
import { chdir, initDb } from './util';
var shell = require('shelljs');
var path = require('path');
describe('#koa-cola cli', function() {
    var server;
	before(function() {
		chdir();
	});
	after(function(done){
		delete global.app;
	})

	describe('#cli', function() {
		it('#new project', function(done){
			shell.exec(`node ${path.resolve('../', 'bin', 'koa-cola')} new app`);
			fs.existsSync(path.resolve('./', 'app')).should.be.equal(true);
			fs.existsSync(path.resolve('./', 'app', 'node_modules')).should.be.equal(true);
			done();
		});
		// it('#launch project', async function(){
		// 	shell.cd('app');
		// 	shell.exec('nohup koa-cola &');
		// 	var res = await request('http://localhost:3000')
        //         .get("/")
        //         .expect(200)
        //         .toPromise();
		// 	res.text.should.be.equal('Wow koa-cola!')	
		// });
	});
});
