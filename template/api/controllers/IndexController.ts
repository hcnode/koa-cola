// import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'controller-decorators';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('controller-decorators');

@Controller('')
export default class  {
    @Get('/')
    @View('index')
    index ( ) {}
}