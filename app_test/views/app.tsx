import * as React from 'react';
import { render } from 'react-dom'
import {createProvider} from 'koa-cola/client'

var Provider = createProvider(
    [
	{
		"component": "simple",
		"path": "/simple",
		"page": require('./pages/simple').default
	},
	{
		"component": "cola",
		"path": "/cola",
		"page": require('./pages/cola').default
	},
	{
		"component": "multiChildren",
		"path": "/multiChildren",
		"page": require('./pages/multiChildren').default
	},
	{
		"component": "autoLoadFromPages1",
		"path": "/autoLoadFromPages1",
		"page": require('./pages/autoLoadFromPages1').default
	},
	{
		"component": "headerAndBundle",
		"path": "/headerAndBundle",
		"page": require('./pages/headerAndBundle').default
	},
	{
		"component": "pageProps",
		"path": "/pageProps",
		"page": require('./pages/pageProps').default
	},
	{
		"component": "subPages/subPage",
		"path": "/subPage",
		"page": require('./pages/subPages/subPage').default
	},
	{
		"component": "validate",
		"path": "/validate",
		"page": require('./pages/validate').default
	}
]
    , require('../config/reduxMiddlewares').reduxMiddlewares
);

render(<Provider />, document.getElementById('app'))