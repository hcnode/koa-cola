import * as React from 'react';
import { render } from 'react-dom'
var {createProvider} = require('koa-cola/dist/client');

var Provider = createProvider([
    // controllers
],{
    // views
});

render(<Provider />, document.getElementById('app'))