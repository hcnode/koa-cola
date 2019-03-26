import {
  Controller,
  Get,
  Use,
  Param,
  Body,
  Delete,
  Put,
  Post,
  QueryParam,
  View,
  Ctx,
  Response
} from '../../../client';
import Ok from '../responses/ok';
import isLogin from '../policies/isLogin';
import setUser from '../middlewares/setUser';
import * as Koa from 'koa'
import * as koaBody from 'koa-body'
@Controller('')
export default class {

  @Get('/')
  index() {
    return 'hello world';
  }

  @Get('/simple')
  @View('simple')
  getView() {}

  @Get('/cola')
  @View('cola')
  getView2() {}

  @Get('/multiChildren')
  @View('multiChildren')
  multiChildren() {}

  @Get('/injectCtx')
  injectCtx(@Ctx() ctx) {
    ctx.response.status = 201;
    ctx.body = 'injectCtx';
  }

  @Post('/postBody')
  @Use(koaBody({ multipart: true }))
  postBody(@Body() body: any) {
    return body;
  }

  @Post('/uploadFiles')
  @Use(koaBody({ multipart: true }))
  uploadFiles(@Body() body: any) {
    return body;
  }

  @Get('/getQuery')
  getQuery(@QueryParam() param: any) {
    return param;
  }

  @Get('/getOkResponse')
  @Response(Ok)
  getOkResponse() {
    return {
      value: 'test'
    };
  }

  @Get('/500')
  get500(@Ctx() ctx) {
    ctx.throw(500);
  }

  @Get('/notLogin')
  @Use(isLogin)
  notLogin(@Ctx() ctx) {
    return 'logined.';
  }

  @Get('/isLogin')
  @Use(setUser, isLogin)
  // @Use(isLogin)
  isLogin(@Ctx() ctx) {
    return 'logined.';
  }

  @Get('/session')
  session(@Ctx() ctx) {
    return ctx.session.count;
  }

  @Get('/testConfigOverride')
  testConfigOverride(@Ctx() ctx) {
    return ctx.session.disabledMiddleware
      ? ctx.session.disabledMiddleware
      : 'diabled';
  }
  @Post('/compose')
  compose(@Body() body: any, @Ctx() ctx) {
    return body;
  }

  @Get('/serverCallApi')
  serverCallApi(@Ctx() ctx) {
    return ctx.cookies.get('server_call_cookie') || 'hello';
  }

  @Get('/autoLoadFromPages1')
  @View('autoLoadFromPages1')
  async autoLoadFromPages1(@Ctx() ctx) {
    return {
      foo: ctx.query.foo
    };
  }

  @Get('/headerAndBundle')
  @View('headerAndBundle')
  async headerAndBundle(@Ctx() ctx) {}

  @Get('/pageProps')
  @View('pageProps')
  async pageProps(@Ctx() ctx) {}

  @Get('/subPage')
  @View('subPages/subPage')
  async subPage(@Ctx() ctx) {}

  @Get('/customHttpCode')
  customHttpCode(@Ctx() ctx){
    ctx.response.status = 450;
  }

  @Get('/renderCustomHttpCode')
  renderCustomHttpCode(@Ctx() ctx){
    ctx.response.status = 452;
  }

  @Get('/neitherStandardCodeNorCustomCode')
  neitherStandardCodeNorCustomCode(@Ctx() ctx){
    ctx.response.status = 453;
  }

  @Get('/fooapi1')
  fooapi1(@Ctx() ctx){
    return {
      koa : ctx.query.foo
    }
  }

  @Post('/fooapi2')
  fooapi2(@Body() body){
    return {
      koa : body.foo
    }
  }
  
  @Get('/createUser')
  async createUser(){
    var User = app.mongoose.model('User');
    await User.create({name : 'Harry', email : 'hcnode@gmail.com'});
    return await User.find({}).then();
  }

  @Get('/validate')
  @View('validate')
  validate() {}

  @Post('/validatePost')
  validatePost(@Body() body: any) {
    return body;
  }
}
