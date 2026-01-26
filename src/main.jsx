import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DetailPage from "./pages/DetailPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ExLandingPage from "./pages/ExLandingPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing-design" replace />} />
        <Route path="/landing-design" element={<LandingPage />} />
        <Route path="/experiment" element={<ExLandingPage />} />
        <Route path="/detail" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
