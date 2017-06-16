import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'controller-decorators';
import * as Koa from 'Koa';
import Ok from '../responses/ok';
import isLogin from '../policies/isLogin';
import setUser from '../middlewares/setUser';

@Controller('')
export default class  {
    @Get('/')
    index ( ) {
        return 'hello world'
    }

    @Get('/getView')
    @View('page1')
    getView ( ) {}


    @Get('/getView2')
    @View('page2')
    getView2 ( ) {}

    @Get('/injectCtx')
    injectCtx (@Ctx() ctx : Koa.Context) {
        ctx.response.status = 201;
        ctx.body = 'injectCtx';
    }

    @Post('/postBody')
    postBody (@Body() body : any) {
        return body;
    }

    @Get('/getQuery')
    getQuery (@QueryParam() param : any) {
        return param;
    }

    @Get('/getOkResponse')
    @Response(Ok)
    getOkResponse () {
        return {
            value : 'test'
        };
    }

    @Get('/500')
    get500 (@Ctx() ctx : Koa.Context) {
        ctx.throw(500);
    }

    @Get('/notLogin')
    @Use(isLogin)
    notLogin (@Ctx() ctx : Koa.Context) {
        return 'logined.'
    }

    @Get('/isLogin')
    @Use(setUser)
    @Use(isLogin)
    isLogin (@Ctx() ctx : Koa.Context) {
        return 'logined.'
    }


    @Get('/session')
    session (@Ctx() ctx : Koa.Context) {
        return ctx.session.count;
    }
}