import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// if (module.hot) module.hot.accept();

ReactDOM.render(
  React.createElement(App, null, null),
  document.getElementById("root")
);
