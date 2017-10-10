/**
 * 启动文件
 */
import App from './index'
var server;
process.on('unhandledRejection', error => {
    /* istanbul ignore next */
    console.error('unhandledRejection', require('util').inspect(error));
});
export function run(colaApp){
    if(server){
        server.close();
    }
    server = App(colaApp);
    return server;
}