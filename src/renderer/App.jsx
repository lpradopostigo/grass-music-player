import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

import "./global.css";
import ReleaseCollectionView from "./views/ReleaseCollectionView";
import ReleaseView from "./views/ReleaseView";
import Player from "./components/Player";

export default function App() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <MemoryRouter>
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
        <Player
          data={{
            title: "AMON",
            artist: "DIR EN GREY",
            releaseTitle: "DUM SPIRO SPERO",
          }}
        />
      </MemoryRouter>
    </div>
  );
}
