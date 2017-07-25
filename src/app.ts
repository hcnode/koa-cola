/**
 * 启动文件
 */
import App from './index'
var server;
export function run(){
    if(server){
        server.close();
    }
    server = App();
    return server;
}