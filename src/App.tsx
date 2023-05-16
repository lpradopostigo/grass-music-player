import Shell from "./features/layout/Shell";
import Header from "./features/layout/Header";
import {
  hashIntegration,
  Navigate,
  Route,
  Router,
  Routes,
} from "@solidjs/router";
import Release from "./features/library/Release";
import Releases from "./features/library/Releases";
import Artists from "./features/library/Artists";
import Artist from "./features/library/Artist";
import MiniPlayer from "./features/mini-player/MiniPlayer";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import Preferences from "./features/preferences/Preferences";
import GlobalStoreProvider from "./providers/GlobalStoreProvider";
import Home from "./features/home/Home";
import Search from "./features/search/Search";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <Router source={hashIntegration()}>
      <GlobalStoreProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="/"
              element={
                <Shell header={<Header />} miniPlayer={<MiniPlayer />} />
              }
            >
              <Route path="/" element={<Navigate href="/releases" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/releases">
                <Route path="/" element={<Releases />} />
                <Route path="/:id" element={<Release />} />
              </Route>
              <Route path="/artists">
                <Route path="/" element={<Artists />} />
                <Route path="/:id" element={<Artist />} />
              </Route>
              <Route path="playlists" element={<div>playlists</div>} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/search" element={<Search />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </GlobalStoreProvider>
    </Router>
  );
}

export default App;
