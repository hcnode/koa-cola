import * as React from 'react';
import { render } from 'react-dom'
var {createProvider} = require('koa-cola/client');

var Provider = createProvider(
    []
,{
    
} 
    , require('../config/reduxMiddlewares').reduxMiddlewares
);

render(<Provider />, document.getElementById('app'))