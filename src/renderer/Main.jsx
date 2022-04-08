import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, Global } from "@mantine/core";

import { Provider } from "react-redux";
import Library from "./views/Library";
import Release from "./views/Release";
import Player from "./components/Player";
import Navigation from "./components/Navigation";
import Preferences from "./views/Preferences";
import theme, { styles, globalStyles } from "./theme";
import App from "./views/App";
import store from "./services/store";

export default function Main() {
  return (
    <Provider store={store}>
      <MantineProvider withNormalizeCSS theme={theme} styles={styles}>
        <Global styles={globalStyles} />
        <MemoryRouter>
          <App player={<Player />} navigation={<Navigation />}>
            <Routes>
              <Route exact path="/" element={<Navigate to="/Library" />} />
              <Route path="/Library" element={<Library />} />
              <Route path="/Release" element={<Release />} />
              <Route path="/Preferences" element={<Preferences />} />
            </Routes>
          </App>
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
}
