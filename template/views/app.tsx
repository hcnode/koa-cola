import * as React from 'react';
import { render } from 'react-dom';
import IndexController from '../api/controllers/IndexController'
import index from './pages/index';
var {createProvider} = require('koa-cola');

var Provider = createProvider([
    IndexController
], {
    index
});

render(<Provider />, document.getElementById('app'));