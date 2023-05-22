/* @refresh reload */
import "./styles.css";
import { render } from "solid-js/web";
import App from "./App.tsx";
import { hashIntegration, Router } from "@solidjs/router";
import { GlobalDataProvider } from "./contexts/GlobalDataContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

// disable native context menu
document.addEventListener("contextmenu", (event) => event.preventDefault());

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

render(
  () => (
    <Router source={hashIntegration()}>
      <QueryClientProvider client={queryClient}>
        <GlobalDataProvider>
          <App />
        </GlobalDataProvider>
      </QueryClientProvider>
    </Router>
  ),
  document.getElementById("root")!
);
