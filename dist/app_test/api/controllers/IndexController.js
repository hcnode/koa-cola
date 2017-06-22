"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } from 'controller-decorators';
var { Controller, Get, Use, Param, Body, Delete, Put, Post, QueryParam, View, Ctx, Response } = app.decorators.controller;
const Koa = require("Koa");
const ok_1 = require("../responses/ok");
const isLogin_1 = require("../policies/isLogin");
const setUser_1 = require("../middlewares/setUser");
const koaBody = require("koa-body");
let default_1 = class default_1 {
    index() {
        return 'hello world';
    }
    getView() { }
    getView2() { }
    injectCtx(ctx) {
        ctx.response.status = 201;
        ctx.body = 'injectCtx';
    }
    postBody(body) {
        return body;
    }
    uploadFiles(body) {
        return body;
    }
    getQuery(param) {
        return param;
    }
    getOkResponse() {
        return {
            value: 'test'
        };
    }
    get500(ctx) {
        ctx.throw(500);
    }
    notLogin(ctx) {
        return 'logined.';
    }
    isLogin(ctx) {
        return 'logined.';
    }
    session(ctx) {
        return ctx.session.count;
    }
    testConfigOverride(ctx) {
        return ctx.session.disabledMiddleware ? ctx.session.disabledMiddleware : 'diabled';
    }
};
__decorate([
    Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "index", null);
__decorate([
    Get('/simple'),
    View('simple'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "getView", null);
__decorate([
    Get('/cola'),
    View('cola'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "getView2", null);
__decorate([
    Get('/injectCtx'),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "injectCtx", null);
__decorate([
    Post('/postBody'),
    Use(koaBody({ multipart: true })),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "postBody", null);
__decorate([
    Post('/uploadFiles'),
    Use(koaBody({ multipart: true })),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "uploadFiles", null);
__decorate([
    Get('/getQuery'),
    __param(0, QueryParam()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "getQuery", null);
__decorate([
    Get('/getOkResponse'),
    Response(ok_1.default),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "getOkResponse", null);
__decorate([
    Get('/500'),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "get500", null);
__decorate([
    Get('/notLogin'),
    Use(isLogin_1.default),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "notLogin", null);
__decorate([
    Get('/isLogin'),
    Use(setUser_1.default),
    Use(isLogin_1.default),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "isLogin", null);
__decorate([
    Get('/session'),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "session", null);
__decorate([
    Get('/testConfigOverride'),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "testConfigOverride", null);
default_1 = __decorate([
    Controller('')
], default_1);
exports.default = default_1;
