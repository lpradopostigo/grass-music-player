import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, Global } from "@mantine/core";

import "./global.css";
import { Provider } from "react-redux";
import Library from "./views/Library";
import Release from "./views/Release";
import Player from "./components/Player";
import Navigation from "./components/Navigation";
// import Settings from "./views/Settings";
import theme, { styles } from "./theme";
import App from "./views/App";
import store from "./services/store";

export default function Main() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme} styles={styles}>
        <Global
          styles={(theme) => ({
            body: {
              color: theme.black,
              WebkitUserSelect: "none",
            },
          })}
        />
        <MemoryRouter>
          <App player={<Player />} navigation={<Navigation />}>
            <Routes>
              <Route exact path="/" element={<Navigate to="/Library" />} />
              <Route path="/Library" element={<Library />} />
              <Route path="/Release" element={<Release />} />
              {/* <Route path="/Settings" element={<Settings />} /> */}
            </Routes>
          </App>
        </MemoryRouter>
      </MantineProvider>
    </Provider>
  );
}
