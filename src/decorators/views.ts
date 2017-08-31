export function ColaReducer(reducers) {
  return function(target) {
    target._reducer = reducers;
  };
}

export function ChildrenComponents(components) {
  return function(target) {
    target.childrenComponents = components;
  };
}
export function header(header) {
  return function(target) {
    target.Header = header;
  };
}

export function bundle(bundle) {
  return function(target) {
    target._bundle = bundle;
  };
}

export function doNotUseLayout(target: any) {
  target._doNotUseLayout = true;
}
var { asyncConnect } = require('redux-connect');

export function Cola() {
  var args = Array.from(arguments);
  return function(target) {
    var map = args.shift() || {};
    var reducer = args.pop();
    var component = asyncConnect(Object.keys(map).map(item => {
      return {
        key : item,
        promise : map[item]
      }
    }), ...args)(target);
    component._reducer = reducer;
    return component;
  };
}