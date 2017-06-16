import * as serialize from 'serialize-javascript';
export default function(html, store){
    return `
<!doctype html>
<html>
    <body id="app">${html}</body>
</html>
    `
}

//<div id="app">${html}</div>
  