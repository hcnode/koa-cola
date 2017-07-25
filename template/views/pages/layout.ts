export default function(html, store){
    return `
<!doctype html>
<html>
    <body>
        <div id="app">${html}</div>
    </body>
    <script src="/bundle.js"></script>
</html>
    `
}

  