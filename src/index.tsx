/* @refresh reload */
import "./styles.css";
import { render } from "solid-js/web";
import App from "./App.tsx";
import { hashIntegration, Router } from "@solidjs/router";
import GlobalStoreProvider from "./providers/GlobalStoreProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import HistoryProvider from "./providers/HistoryProvider.tsx";

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
        <GlobalStoreProvider>
          <HistoryProvider>
            <App />
          </HistoryProvider>
        </GlobalStoreProvider>
      </QueryClientProvider>
    </Router>
  ),
  document.getElementById("root")!
);
