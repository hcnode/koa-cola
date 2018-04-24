import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'koa-cola/client';

@Controller('')
export default class  {
    @Get('/')
    @View('index')
    index ( ) {}
}