import App from "./App.svelte";

const app = new App({
  target: document.getElementById("root"),
  props: {
    name: "Svelte",
  },
});

export default app;
