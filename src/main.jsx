import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import DetailPage from "./pages/DetailPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LandingPageVer2 from "./pages/LandingPageVer2.jsx";
import ExploreMore from "./pages/ExploreMore.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing-v2" replace />} />
        <Route path="/landing-design" element={<LandingPage />} />
        <Route path="/explore" element={<ExploreMore />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/landing-v2" element={<LandingPageVer2 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
