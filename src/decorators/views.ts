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