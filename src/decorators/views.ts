/* export function ColaReducer(reducers) {
  return function(target) {
    target._reducer = reducers;
  };
} */

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

export function pageProps(pageProps) {
  return function(target) {
    target._pagePros = pageProps;
  };
}

export function doNotUseLayout(target: any) {
  target._doNotUseLayout = true;
}
import { asyncConnect } from "redux-connect-new";

export function Cola({
  initData = {},
  mapStateToProps = null,
  mapDispatchToProps = null,
  reducer = null
}: {
  initData?: any;
  mapStateToProps?: any;
  mapDispatchToProps?: any;
  reducer?: any;
}) {
  return function(target) {
    var component = asyncConnect(
      Object.keys(initData).map(item => {
        return {
          key: item,
          promise: initData[item]
        };
      }),
      mapStateToProps,
      mapDispatchToProps
    )(target);
    if (reducer) {
      component._reducer = reducer;
    }
    return component;
  };
}

export function autoRouter(target: any) {
  target._autoRouter = true;
}
