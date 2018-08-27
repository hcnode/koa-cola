"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 创建基于mongoose的mongodb数据库的实体类typing，并保存在typings/schema.ts，生成的文件可参考：app_test/typings/schema.ts
 * 目的可以和api.ts结合使用，通过api对象获取result属性，并通过vscode的intellisense可以自动识别实体类和对应的字段
 * 可参考app_test/api.ts
 */
const path = require("path");
const require_1 = require("./require");
const fs = require("fs");
const mongoose = require("mongoose");
const chalk = require("chalk");
function getFields(documentSchema) {
    documentSchema = documentSchema.tree || documentSchema;
    return Object.keys(documentSchema).map(field => {
        if (field == 'id')
            return '';
        let code = `
            /**
             * ${documentSchema[field].text || field}
             */
        `;
        let type = documentSchema[field].type || documentSchema[field];
        const isArray = Array.isArray(type);
        if (isArray) {
            type = type[0];
        }
        type = type.type || type;
        // subdoc
        if (type.tree || (!type.schemaName && Object.prototype.toString.call(type) == '[object Object]')) {
            code += `
                ${field} : ${isArray ? '[' : ''}
                    {
                        ${getFields(type)}
                    }
                ${isArray ? ']' : ''}
            `;
        }
        else if (type.schemaName) {
            code += `
                ${field} : ${isArray ? '[' : ''} 
                    mongoose.Schema.Types.${type.schemaName} 
                ${isArray ? ']' : ''}
            `;
        }
        else {
            code += `
                ${field} : ${isArray ? "[" : ""} 
                    ${(/\[object (.+)\]/.test(Object.prototype.toString.call(type())) && RegExp.$1).toLowerCase()}
                ${isArray ? "]" : ""}
            `;
        }
        return code;
    }).join("");
}
function default_1() {
    const dir = process.cwd();
    const schemasPath = path.resolve(dir, 'api/schemas');
    const typingsPath = path.resolve(dir, 'typings');
    if (!fs.existsSync(schemasPath))
        return console.log('schema path not found');
    if (!fs.existsSync(typingsPath))
        return console.log('typings path not found');
    const schemaTypesFile = path.resolve(typingsPath, 'schema.ts');
    const schemas = require_1.reqDir(schemasPath);
    const codeFields = Object.keys(schemas).map(schema => Object.keys(schemas[schema]).map(document => {
        const documentSchema = schemas[schema][document](mongoose);
        return `
                export interface ${document} {
                    ${getFields(documentSchema)}
                }
            `;
    }).join("")).join("");
    let codes = `
        import * as mongoose from 'mongoose';
        ${codeFields}
    `;
    const beautify = require('js-beautify').js_beautify;
    try {
        fs.writeFileSync(schemaTypesFile, beautify(codes, { indent_size: 4 }));
        console.log(chalk.green('model schemas created.'));
    }
    catch (e) {
        console.log(e);
    }
}
exports.default = default_1;
//# sourceMappingURL=createSchemaTypes.js.map