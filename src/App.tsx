import Shell from "./components/Shell";
import MiniPlayer from "./components/MiniPlayer";
import NavigationBar from "./components/NavigationBar";
import Library from "./pages/Library";
import Release from "./pages/Release";
import { Routes, Route, Navigate } from "@solidjs/router";
import PlayerStateProvider from "./providers/PlayerStateProvider";
import Settings from "./pages/Settings";
import SettingsProvider from "./providers/SettingsProvider";
import TitleBarThemeProvider from "./components/Shell/TitleBarThemeProvider";

const App = () => (
  <PlayerStateProvider>
    <SettingsProvider>
      <TitleBarThemeProvider>
        <Shell miniPlayer={<MiniPlayer />} navigationBar={<NavigationBar />}>
          <Routes>
            <Route path="/" element={<Navigate href="/library" />} />
            <Route element={<Library />} path="/library" />
            <Route element={<Release />} path="/library/release/:id" />
            <Route element={<Settings />} path="/settings" />
          </Routes>
        </Shell>
      </TitleBarThemeProvider>
    </SettingsProvider>
  </PlayerStateProvider>
);

export default App;
