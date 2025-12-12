import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Sidebar from "./layout/Sidebar";
import FactoriesPage from "./pages/FactoriesPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";

export default function App() {
  return (
    <Router>
      <CssBaseline />
      <Sidebar>
        <Routes>
          <Route path="/" element={<FactoriesPage />} />
          <Route path="/factory/:factoryId" element={<AlgorithmsPage />} />
          <Route path="/algorithm/:algorithmId" element={<ModelsPage />} />
          <Route path="/model/:modelId" element={<ModelDetailPage />} />
          
        </Routes>
      </Sidebar>
    </Router>
  );
}
