import * as React from 'react';
import { render } from 'react-dom'
var {createProvider} = require('../../dist');

// 暂时没有想到办法可以不使用fs方式require controllers目录和views目录下面所有的文件
var Provider = createProvider([
    require('../api/controllers/IndexController').default
],{
    cola : require('./pages/cola').default,
    simple : require('./pages/simple').default,
});

render(<Provider />, document.getElementById('app'))