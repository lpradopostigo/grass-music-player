import Shell from "./features/layout/Shell.tsx";
import Header from "./features/layout/header/Header.tsx";
import { Navigate, Route, Routes } from "@solidjs/router";
import Release from "./features/library/release/Release.tsx";
import Releases from "./features/library/Releases.tsx";
import Artists from "./features/library/Artists.tsx";
import Artist from "./features/library/Artist.tsx";
import MiniPlayer from "./features/mini-player/MiniPlayer.tsx";
import Preferences from "./features/preferences/Preferences.tsx";
import Home from "./features/home/Home.tsx";
import { createEventListener } from "@solid-primitives/event-listener";
import { useGlobalData } from "./contexts/GlobalDataContext.tsx";

function App() {
  const { scanState } = useGlobalData();

  createEventListener(
    () => document,
    "keydown",
    (event) => {
      if (
        Array.isArray(scanState()) ||
        (event.target as HTMLElement | null)?.closest(
          "[role=dialog],[role=alertdialog]"
        )
      )
        return;

      if (event.key === "Escape") {
        history.back();
      }
    }
  );

  return (
    <Routes>
      <Route
        path="/"
        element={<Shell header={<Header />} miniPlayer={<MiniPlayer />} />}
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
      </Route>
    </Routes>
  );
}

export default App;
