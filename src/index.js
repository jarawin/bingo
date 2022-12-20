import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Bingo from "./pages/Bingo";
import Home from "./pages/Home";
import Server from "./pages/Server";
import Control from "./pages/Control";
import ChangeColor from "./pages/command/ChangeColor";
import ResetLocalStorage from "./pages/command/ResetLocalStorage";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// "react": "^18.2.0",
// "react-dom": "^18.2.0",
// "react-scripts": "5.0.1",

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path=":id" element={<Home />} />
          <Route path="server" element={<Server />} />

          <Route path="bingo" element={<Bingo />} />
          <Route path="bingo/:id" element={<Bingo />} />
          <Route path="bingo/server/:id" element={<Control />} />

          {/* command */}
          <Route path="c" element={<ChangeColor />} />
          <Route path="r" element={<ResetLocalStorage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
