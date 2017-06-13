import * as serialize from 'serialize-javascript';
export default function(html, store){
    return `
<!doctype html>
<html>
    <body>
    <div id="app">${html}</div>
    <!-- its a Redux initial data -->
    <script>
        window.__data=${serialize(store.getState())};
    </script>
    <script src="/bundle.js"></script>
    </body>
</html>
    `
}