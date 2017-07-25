import * as React from 'react';
import { render } from 'react-dom';
var {createProvider} = require('koa-cola');

// 暂时没有想到办法可以不使用fs方式require controllers目录和views目录下面所有的文件
var Provider = createProvider([
    require('../api/controllers/IndexController').default
], {
    index : require('./pages/index').default
});

render(<Provider />, document.getElementById('app'));