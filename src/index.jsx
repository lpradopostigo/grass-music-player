/* @refresh reload */
import "./styles/index.css";
import { render } from "solid-js/web";

import App from "./App";
import { hashIntegration, Router } from "@solidjs/router";

render(
  () => (
    <Router source={hashIntegration()}>
      <App />
    </Router>
  ),
  document.getElementById("root")
);
