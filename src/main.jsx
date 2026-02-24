import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DetailPage from "./pages/DetailPage.jsx";
import Landing from "./pages/Landing.jsx";
import ExploreMore from "./pages/ExploreMore.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/explore" element={<ExploreMore />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
