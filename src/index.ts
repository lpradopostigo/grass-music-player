/* @refresh reload */
import "./styles/index.css";
import { render } from "solid-js/web";
import App from "./App";

// disable native context menu
document.addEventListener("contextmenu", (event) => event.preventDefault());

render(App, document.getElementById("root")!);
