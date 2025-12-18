// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Sidebar from "./layout/Sidebar";
import FactoriesPage from "./pages/FactoriesPage";
import AlgorithmsPage from "./pages/AlgorithmsPage";
import ModelsPage from "./pages/ModelsPage";
import ModelDetailPage from "./pages/ModelDetailPage";
import DashboardPage from "./pages/DashboardPage";
import AllModelsPage from "./pages/AllModelsPage";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <>
      <CssBaseline />
      <Router>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute />}>

            {/* Layout wrapper */}
            <Route element={<Sidebar />}>

              <Route path="/dashboard" element={<DashboardPage />} />

              <Route path="/" element={<FactoriesPage />} />
              <Route path="/factories" element={<FactoriesPage />} />

              <Route path="/factory/:factoryId" element={<AlgorithmsPage />} />
              <Route path="/algorithms" element={<AlgorithmsPage />} />

              <Route path="/algorithm/:algorithmId" element={<ModelsPage />} />
              <Route path="/models" element={<AllModelsPage />} />

              <Route path="/model/:modelId" element={<ModelDetailPage />} />

            </Route>

          </Route>

          {/* fallback */}
          <Route path="*" element={<Login />} />

        </Routes>

      </Router>
    </>
  );
}
