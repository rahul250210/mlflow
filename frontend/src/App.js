// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Sidebar from "./layout/Sidebar";
import FactoriesPage from "./pages/FactoriesPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Sidebar>
        <Routes>
          <Route path="/" element={<FactoriesPage />} />
          <Route path="/factories" element={<FactoriesPage />} /> 
          {/* Algorithms: scoped by factory OR global list */}
          <Route path="/factory/:factoryId" element={<AlgorithmsPage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />

          {/* Models: scoped by algorithm OR global list */}
          <Route path="/algorithm/:algorithmId" element={<ModelsPage />} />
          <Route path="/models" element={<ModelsPage />} />

          {/* Model detail */}
          <Route path="/model/:modelId" element={<ModelDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Sidebar>
    </Router>
  );
}
