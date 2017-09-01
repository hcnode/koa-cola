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

export function Cola({initData = {}, mapStateToProps = null, mapDispatchToProps = null, reducer = null}) {
  return function(target) {
    var component = asyncConnect(Object.keys(initData).map(item => {
      return {
        key : item,
        promise : initData[item]
      }
    }), mapStateToProps, mapDispatchToProps)(target);
    if(reducer) {
      component._reducer = reducer;
    }
    return component;
  };
}