export {default as Decorators} from './src/util/decorators';
try{
    var { run } = require('./src/app');
}catch(e){}
export const RunApp = run;