import * as serialize from 'serialize-javascript';
export default function(html, store, renderProps, {title}){
    var name = renderProps.components[1].name;
    return `
<!doctype html>
<html>
    <head>
        <title>${title || ''}</title>
    </head>
    <body id="app">${html}</body>
</html>
${name == 'page404' ? '' : '<script src="/bundle.js"></script>'}
    `
}

  