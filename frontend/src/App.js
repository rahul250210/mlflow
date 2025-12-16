// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Sidebar from "./layout/Sidebar";
import FactoriesPage from "./pages/FactoriesPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import DashboardPage from "./pages/DashboardPage";
import AllModelsPage from "./pages/AllModelsPage";

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Sidebar>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Factories */}
          <Route path="/" element={<FactoriesPage />} />
          <Route path="/factories" element={<FactoriesPage />} />

          {/* Algorithms */}
          <Route path="/factory/:factoryId" element={<AlgorithmsPage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />

          {/* Models */}
          <Route path="/algorithm/:algorithmId" element={<ModelsPage />} />
          <Route path="/models" element={<AllModelsPage />} />

          {/* Model Detail */}
          <Route path="/model/:modelId" element={<ModelDetailPage />} />

          {/* Fallback */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}
