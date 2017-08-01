/**
 * 启动文件
 */
import App from './index'
var server;
export function run(colaApp){
    if(server){
        server.close();
    }
    server = App(colaApp);
    return server;
}