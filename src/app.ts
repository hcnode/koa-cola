import App from './index'
var server;
run();
export function run(){
    if(server){
        server.close();
    }
    server = App();
}