import 'reflect-metadata';
const REDUCER_PREFIX = "#REDUCER_PREFIX";

export function Reducer(reducers : any) {
  return function(target) {
    Reflect.defineMetadata(REDUCER_PREFIX, reducers, target);
  };
};

export function getReducer(target : any){
  return REDUCER_PREFIX;
}
