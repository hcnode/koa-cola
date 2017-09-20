import * as React from 'react'
var {RunApp} = require('koa-cola')
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = require('koa-cola/client');
@Controller('') 
class FooController {
    @Get('/')
    index(@Ctx() ctx) {
        return '<h1>Wow koa-cola!</h1>'
    }

    @Get('/view')
    @View('some_view')
    async view( @Ctx() ctx ) { 
        return await Promise.resolve({
            foo : 'bar'
        });
    } 
}
RunApp({
    controllers: {
        FooController: FooController
    },
    pages: {
        some_view : function({ctrl : {foo}}){
            return <div>{foo}</div>
        }
    }
});
