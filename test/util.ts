export function chdir(){
    if(process.cwd().indexOf('app_test') == -1){
        process.chdir('./app_test');
    }
}