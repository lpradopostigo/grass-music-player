import Shell from "./components/Shell/index.jsx";
import MiniPlayer from "./components/MiniPlayer";
import NavigationBar from "./components/NavigationBar/index.jsx";
import Library from "./pages/Library/index.jsx";
import Release from "./pages/Release/index.jsx";
import { Routes, Route, Navigate } from "@solidjs/router";
import { PlayerStateProvider } from "./services/Player/context.jsx";

const App = () => (
  <PlayerStateProvider>
    <Shell miniPlayer={<MiniPlayer />} navigationBar={<NavigationBar />}>
      <Routes>
        <Route path="/" element={<Navigate href="/library" />} />
        <Route element={<Library />} path="/library" />
        <Route element={<Release />} path="/library/release/:id" />
        <Route element={<div>setting</div>} path="/settings" />
      </Routes>
    </Shell>
  </PlayerStateProvider>
);

export default App;
