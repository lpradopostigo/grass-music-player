import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

import "./global.css";
import ReleaseCollectionView from "./views/ReleaseCollectionView";
import ReleaseView from "./views/ReleaseView";
import Player from "./components/Player";
import SideBar from "./views/SideBar";

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        maxHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MemoryRouter>
        <div
          style={{
            flex: "1 0 0",
            display: "flex",
            minHeight: 0,
          }}
        >
          <SideBar />
          <Routes>
            <Route
              exact
              path="/"
              element={<Navigate to="/ReleaseCollectionView" />}
            />

            <Route
              path="/ReleaseCollectionView"
              element={<ReleaseCollectionView />}
            />

            <Route path="/ReleaseView" element={<ReleaseView />} />
          </Routes>
        </div>

        <Player />
      </MemoryRouter>
    </div>
  );
}
