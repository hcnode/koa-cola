require('should')
import * as should from 'should'
import * as Koa from 'koa'
import * as request from 'supertest-as-promised'
import * as React from 'react'
import * as fs from 'fs'
import { chdir, initDb } from './util';
var shell = require('shelljs');
var path = require('path');
var App = require('../dist').RunApp
describe('#koa-cola cli', function() {
    var server;
	before(function() {
		chdir();
	});
	after(function(done){
		process.chdir(`${path.resolve(__dirname, '../')}`);
		delete global.app;
		done();
	})

	describe('#cli', function() {
		it('#new project', function(done){
			shell.exec(`node ${path.resolve('../', 'bin', 'koa-cola')} new app`);
			fs.existsSync(path.resolve('./', 'app')).should.be.equal(true);
			fs.existsSync(path.resolve('./', 'app', 'node_modules')).should.be.equal(true);
			done();
		});
		it('#launch project', async function(){
			process.chdir('./app');
			server = App();
			var res = await request(server)
                .get("/")
                .expect(200)
                .toPromise();
			res.text.should.be.containEql('Wow koa-cola!');
			server.close();
			process.chdir('../');
			shell.exec('rm -rf app');
		});
		it('#new project with api mode', function(done){
			shell.exec(`node ${path.resolve('../', 'bin', 'koa-cola')} new app -m api`);
			fs.existsSync(path.resolve('./', 'app', 'app.tsx')).should.be.equal(true);
			fs.existsSync(path.resolve('./', 'app', 'node_modules')).should.be.equal(true);
			shell.exec('rm -rf app');
			done();
		});
	});
});
