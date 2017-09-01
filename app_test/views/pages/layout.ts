import * as serialize from 'serialize-javascript';
export default function(html, store, renderProps, {title}){
    return `
<!doctype html>
<html>
    <head>
        <title>${title}</title>
    </head>
    <body id="app">${html}</body>
</html>
<script src="/bundle.js"></script>
    `
}

  