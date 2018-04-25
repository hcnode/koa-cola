import * as serialize from 'serialize-javascript';
export default function(html, store, component, {title}){
    var name = component.name;
    return `
<!doctype html>
<html>
    <head>
        <title>${title || ''}</title>
    </head>
    <body><div id="app">${html}</div></body>
</html>
${name == 'page404' ? '' : '<script src="/bundle.js"></script>'}
    `
}

  