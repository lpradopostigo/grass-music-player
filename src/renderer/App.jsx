import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";

import "./global.css";
import ReleaseCollectionView from "./views/ReleaseCollectionView";
import ReleaseView from "./views/ReleaseView";

export default function App() {
  return (
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
    </MemoryRouter>
  );
}
