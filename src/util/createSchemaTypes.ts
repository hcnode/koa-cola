/**
 * 创建基于mongoose的mongodb数据库的实体类typing，并保存在typings/schema.ts，生成的文件可参考：app_test/typings/schema.ts
 * 目的可以和api.ts结合使用，通过api对象获取result属性，并通过vscode的intellisense可以自动识别实体类和对应的字段
 * 可参考app_test/api.ts
 */
import * as path from 'path'
import {reqDir} from './require'
import * as fs from 'fs';
import * as mongoose from 'mongoose';
import * as chalk from 'chalk';
function getFields (documentSchema){
    documentSchema = documentSchema.tree || documentSchema;
    return Object.keys(documentSchema).map(field => {
        if(field == 'id') return ``;
        
        var type = documentSchema[field].type || documentSchema[field];
        var isArray = Array.isArray(type);
        if(isArray){
            type = type[0];
        }
        type = type.type || type;
        var code = `
        /**
         * ${documentSchema[field].text || field}
         */
        `;
        // subdoc
        if(type.tree || (!type.schemaName && Object.prototype.toString.call(type) == '[object Object]')){
            code += `
                ${field} : ${isArray ? '[' : ''}{
                    ${getFields (type)}
                }${isArray ? ']' : ''}
            `
        }else if(type.schemaName){
            code +=  `
                ${field} : ${isArray ? '[' : ''} mongoose.Schema.Types.${type.schemaName} ${isArray ? ']' : ''}
            `
        }else{
            code += `
                ${field} : ${isArray ? '[' : ''} ${(/\[object (.+)\]/.test(Object.prototype.toString.call(type())) && RegExp.$1).toLowerCase()}  ${isArray ? ']' : ''}
            `
        }
        return code;
    }).join(``);
}
export default function (){
    var dir = process.cwd();
    var schemasPath = path.resolve(dir, 'api/schemas');
    if(fs.existsSync(schemasPath)){
        var typingsPath = path.resolve(dir, 'typings');
        if(fs.existsSync(typingsPath)){
            var schemaTypesFile = path.resolve(typingsPath, 'schema.d.ts');
            var schemas = reqDir(schemasPath);
            var codes = `
                import * as mongoose from 'mongoose'
                ${Object.keys(schemas).map(schema => `
                    ${Object.keys(schemas[schema]).map(document => {
                        var documentSchema = schemas[schema][document](mongoose);
                        
                        return `
                            export interface ${document} {
                                ${getFields(documentSchema)}
                            }
                        `
                    }).join(``)}
                `).join(``)}
            `
            
            var beautify = require('js-beautify').js_beautify;
            try{
                fs.writeFileSync(schemaTypesFile, beautify(codes, { indent_size: 4 }))
                console.log(chalk.green('model schemas created.'));
            }catch(e){
                console.log(e)
            }
        }else{
            console.log('typings path not found')
        }
    }else{
        console.log('schema path not found')
    }
}