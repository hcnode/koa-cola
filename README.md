
# koa-cola
[![Build Status](https://travis-ci.org/hcnode/koa-cola.svg?branch=master)](https://travis-ci.org/hcnode/koa-cola)
[![Coverage Status](https://coveralls.io/repos/github/hcnode/koa-cola/badge.svg?branch=master)](https://coveralls.io/github/hcnode/koa-cola?branch=master)
[![npm](https://img.shields.io/npm/v/koa-cola.svg)](https://www.npmjs.com/package/koa-cola)

[中文版readme](https://github.com/hcnode/koa-cola/blob/master/README_zh.md)

[koa-cola](https://koa-cola.github.io/) is SSR(server side render)/SPA(singe page application) framework with koa/react/react-router/redux/typescript, and using reactjs stack(react component/react-router/react-redux) and "isomorphic" codes (used in both browser and server side).

Actually this framework is my experimental work to explore the advanced area of javascript and node.js, like "isomorphic" in reactjs stack(react component/react-router/react-redux), async/await, typescript, es7 decorator, etc.

### Features
* completely and seamlessly SSR/SPA solution.
* "isomorphic" mode which can write reusable codes running in both browser and server.
* es7 decorator style coding

## Usage

because koa-cola require latest koa version.

> Koa requires node v7.6.0 or higher for ES2015 and async function support.

so koa-cola requires node v7.6.0 or higher as well. Node.js v8 comes with significantly improved performance of ES2017 async functions, so node v8 or higher is recommended. 

* `npm i koa-cola ts-node typescript -g` install global koa-cola and ts-node typescript dependences
* `koa-cola new koa-cola-app` create new koa-cola project in current folder
* `cd koa-cola-app`
* `koa-cola dev` start dev mode to build bundle and launch server.

## Compare next.js
[next.js](https://github.com/zeit/next.js) is one of the popular SSR and reactjs base frameworks, but some difference between koa-cola and next.js.

### fetch data
next.js provide static method "getInitialProps" to fetch data：
```javascript
import React from 'react'
export default class extends React.Component {
  static async getInitialProps ({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

koa-cola provide two ways to fetch data.

1. use Cola decorator to fetch data:
```javascript
import React from 'react'
var { Cola } = require('koa-cola/client');

@Cola({
  initData : {
    userAgent : req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
})
export default class extends React.Component {
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}
```

2. fetch data in server router
```javascript
// in controller
@Controller('') 
class FooController {
    @Get('/some_page')  
    @View('some_page') 
    some_page (@Ctx() ctx) { 
      return userAgent: ctx.req.headers['user-agent']
    }
}

// in page
export default function({ ctrl : {userAgent} }) {
  return <div>
    Hello World {userAgent}
  </div>
}
```

the first way fetch data in koa-cola props actually come from react-redux, because koa-cola combines all pages reducer into redux, so in browser espcially in SPA, you can share this kind of props in all pages. while next.js has not support this yet.

### support children components data fetch

next.js does not support fetch data in children components:
> Note: getInitialProps can not be used in children components. Only in pages.

but in koa-cola this can easy be supported by using the decorator "include":

```javascript
// in child component
@Cola({
  initData : {
    userAgent : req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent }
  }
})
class Child extends React.Component {
  render () {
    return <div>
      Hello World {this.props.userAgent}
    </div>
  }
}


// in page
var { Cola, include } = require('koa-cola/client');
@include({
  Child
})
export default class Page extends React.Component{
  render() {
    return <div>
        <Child {...this.props} />
      </div>
  }
}

```

[online demo](http://koa-cola.com:3000/)

visit [koa-cola website](https://koa-cola.github.io/) for more detail
