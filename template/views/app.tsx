import * as React from "react";
import { render } from "react-dom";
import { createProvider } from "koa-cola/client";

var Provider = createProvider(
  [
    {
      component: "index",
      path: "/"
    }
  ],
  {
    index: require("./pages/index").default
  }
);

render(<Provider />, document.getElementById("app"));
