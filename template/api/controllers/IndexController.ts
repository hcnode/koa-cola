// import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'controller-decorators';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('koa-cola/dist/client').Decorators.controller;

@Controller('')
export default class  {
    @Get('/')
    @View('index')
    index ( ) {}
}