export {default as Decorators} from './src/util/decorators';
export { Base as ApiBase, fetch as apiFetch } from './src/util/api';
try{
    var { run } = require('./src/app');
}catch(e){}
export const RunApp = run;