import Shell from "./components/Shell/index.jsx";
import MiniPlayer from "./components/MiniPlayer";
import NavigationBar from "./components/NavigationBar/index.jsx";
import Library from "./pages/Library/index.jsx";
import Release from "./pages/Release/index.jsx";
import { Routes, Route, Navigate } from "@solidjs/router";
import PlayerStateProvider from "./commands/Player/PlayerStateProvider.jsx";
import Settings from "./pages/Settings/index.jsx";
import SettingsProvider from "./utils/SettingsProvider.jsx";
import TitleBarThemeProvider from "./components/Shell/TitleBarThemeProvider.jsx";

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
