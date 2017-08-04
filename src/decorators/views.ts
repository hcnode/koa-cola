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