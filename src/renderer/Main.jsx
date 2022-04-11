import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, Global } from "@mantine/core";

import { Provider } from "react-redux";
import Library from "./components/library/Library";
import ReleaseDetail from "./components/release-detail/ReleaseDetail";
import Player from "./components/player/Player";
import Navigation from "./components/navigation/Navigation";
import Preferences from "./components/preferences/Preferences";
import theme, { styles, globalStyles } from "./theme/theme";
import App from "./components/app/App";
import store from "./services/store";

export default function Main() {
  return (
    <Provider store={store}>
      <MantineProvider withNormalizeCSS theme={theme} styles={styles}>
        <Global styles={globalStyles} />
        <MemoryRouter>
          <App player={<Player />} navigation={<Navigation />}>
            <Routes>
              <Route exact path="/" element={<Navigate to="/library" />} />
              <Route path="/library" element={<Library />} />
              <Route path="/library/*" element={<ReleaseDetail />} />
              <Route path="/preferences" element={<Preferences />} />
            </Routes>
          </App>
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
}
