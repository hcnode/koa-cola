export function Reducer(reducer : any) {
  return function(target) {
    target._reducer = reducer()
  };
};

