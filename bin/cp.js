#!/usr/bin/env ts-node

var path = require('path');
var shell = require('shelljs');
var args = process.argv;
var s = args[args.length - 2];
var d = args[args.length - 1];
if(s && d){
  shell.cp(path.join(process.cwd(), s), path.join(process.cwd(), d));
}
// shell.cp
