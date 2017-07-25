// import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'controller-decorators';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('../../../dist').Decorators.controller;
import Ok from '../responses/ok';
import checkUser from '../middlewares/checkUser'

@Controller('')
export default class  {
    @Get('/')
    @View('index')
    index ( ) {}

    @Get('/login')
    @View('login')
    login ( ) {}

    @Post('/login')
    doLogin (@Ctx() ctx,  @Body() {name = 'harry', email = 'hcnode@gmail.com'}) {
        ctx.session.user = {
            name, email
        }
    }
}