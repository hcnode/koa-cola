import * as serialize from 'serialize-javascript';
export default function(html, store){
    return `
<!doctype html>
<html>
    <body id="app">${html}</body>
    <script src="/bundle.js"></script>
</html>
    <script>
       /* window.onerror = function (msg, url, lineNo, columnNo, error) {
            var string = msg.toLowerCase();
            var substring = "script error";
            if (string.indexOf(substring) > -1){
                console.log('Script Error: See Browser Console for Detail');
            } else {
                var message = [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Column: ' + columnNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ');

                console.log(message);
            }

            return false;
        };*/
    </script>
    `
}

  