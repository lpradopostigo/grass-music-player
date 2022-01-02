import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>
  );
}
