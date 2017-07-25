import * as React from 'react';
import { renderToString } from 'react-dom/server'
export default function createErrorPage({
    env,
    ctx,
    error,
    stack,
    status = 500,
    code = 500
}){
    // some errors will have .status
    // however this is not a guarantee
    ctx.status = status || 500;
    ctx.type = 'html';
    // 如果定义了错误对应的page，则使用page来渲染
    var ErrorPage = app.pages[status];
    if(ErrorPage){
        ctx.body = renderToString(<ErrorPage {...arguments[0]} />)
    }else{
        // production ignore error stack
        if(process.env.NODE_ENV == 'production'){
            ctx.body = error;
        }else{
            ctx.body = `
                <p>${error}</p>
                <p>${stack}</p>
            `;
        }
    }
}