"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var require_1 = require("./require");
var fs = require("fs");
function getFields(documentSchema) {
    documentSchema = documentSchema.tree || documentSchema;
    return Object.keys(documentSchema).map(function (field) {
        if (field == 'id') return "";
        var type = documentSchema[field].type || documentSchema[field];
        var isArray = Array.isArray(type);
        if (isArray) {
            type = type[0];
        }
        type = type.type || type;
        var code = "\n        /**\n         * " + (documentSchema[field].text || field) + "\n         */\n        ";
        // subdoc
        if (type.tree || !type.schemaName && Object.prototype.toString.call(type) == '[object Object]') {
            code += "\n                " + field + " : " + (isArray ? '[' : '') + "{\n                    " + getFields(type) + "\n                }" + (isArray ? ']' : '') + "\n            ";
        } else if (type.schemaName) {
            code += "\n                " + field + " : " + (isArray ? '[' : '') + " mongoose.Schema.Types." + type.schemaName + " " + (isArray ? ']' : '') + "\n            ";
        } else {
            code += "\n                " + field + " : " + (isArray ? '[' : '') + " " + (/\[object (.+)\]/.test(Object.prototype.toString.call(type())) && RegExp.$1).toLowerCase() + "  " + (isArray ? ']' : '') + "\n            ";
        }
        return code;
    }).join("");
}
function default_1() {
    var dir = process.cwd();
    var schemasPath = path.resolve(dir, 'api/schemas');
    if (fs.existsSync(schemasPath)) {
        var typingsPath = path.resolve(dir, 'typings');
        if (fs.existsSync(typingsPath)) {
            var schemaTypesFile = path.resolve(typingsPath, 'schema.d.ts');
            var schemas = require_1.reqDir(schemasPath);
            var codes = "\n                import * as mongoose from 'mongoose'\n                " + Object.keys(schemas).map(function (schema) {
                return "\n                    " + Object.keys(schemas[schema]).map(function (document) {
                    var documentSchema = schemas[schema][document](app.mongoose);
                    return "\n                            export interface " + document + " {\n                                " + getFields(documentSchema) + "\n                            }\n                        ";
                }).join("") + "\n                ";
            }).join("") + "\n            ";
            var beautify = require('js-beautify').js_beautify;
            try {
                fs.writeFileSync(path.resolve(typingsPath, 'schema.ts'), beautify(codes, { indent_size: 4 }));
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('typings path not found');
        }
    } else {
        console.log('schema path not found');
    }
}
exports.default = default_1;