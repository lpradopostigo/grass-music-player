import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, Global } from "@mantine/core";

import "./global.css";
import Library from "./views/Library";
import Release from "./views/Release";
import Player from "./components/Player";
import Navigation from "./components/Navigation";
import Settings from "./views/Settings";
import theme from "./theme";
import App from "./views/App";

export default function Main() {
  return (
    <MantineProvider theme={theme}>
      <Global
        styles={(theme) => ({
          "::-webkit-scrollbar": {
            width: 0,
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: theme.colors.gray[3],
          },

          body: {
            color: theme.black,
          },
        })}
      />
      <MemoryRouter>
        <App player={<Player />} navigation={<Navigation />}>
          <Routes>
            <Route exact path="/" element={<Navigate to="/Library" />} />

            <Route path="/Library" element={<Library />} />

            <Route path="/Release" element={<Release />} />

            <Route path="/Settings" element={<Settings />} />
          </Routes>
        </App>
      </MemoryRouter>
    </MantineProvider>
  );
}
