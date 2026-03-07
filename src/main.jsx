import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import OrdererPage from "./pages/OrdererPage.jsx";
import Landing from "./pages/Landing.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import Stages from "./pages/Stages.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/stages" replace />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/order" element={<OrdererPage />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/stages" element={<Stages />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
