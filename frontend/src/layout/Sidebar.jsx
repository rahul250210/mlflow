"use client";

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  Divider,
  Collapse,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FactoryIcon from "@mui/icons-material/Factory";
import HubIcon from "@mui/icons-material/Hub";
import SchemaIcon from "@mui/icons-material/Schema";
import FolderIcon from "@mui/icons-material/Folder";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useLocation, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Topbar from "./Topbar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const drawerWidth = 260;

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [factoryOpen, setFactoryOpen] = useState(true);
  const [factories, setFactories] = useState([]);

  const handleFactoryToggle = () => setFactoryOpen((prev) => !prev);
  const fetchFactories = async () => {
    try {
      const res = await axiosInstance.get("/factories");
      setFactories(res.data);
    } catch (err) {
      console.error("Error fetching factories:", err);
    }
  };
  
  // 🚀 Fetch factories dynamically
  useEffect(() => {
  fetchFactories(); // Initial load

  // Listen for update event
  const handleUpdate = () => {
    fetchFactories(); // Refresh sidebar factories
  };

  window.addEventListener("factory-updated", handleUpdate);

  return () => {
    window.removeEventListener("factory-updated", handleUpdate);
  };
}, []);

  const menuItems = [
    
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { type: "divider" },

    {
      label: "Factories",
      icon: <FactoryIcon />,
      expandable: true,
    },

  
    { label: "Models", path: "/models", icon: <SchemaIcon /> },
    { label: "All Files", path: "/files", icon: <FolderIcon /> },

    { type: "divider" },
    { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  const isActiveRoute = (path) => location.pathname.startsWith(path);

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(14px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "4px 0 25px rgba(0,0,0,0.35)",
          },
        }}
      >
        <Toolbar />

        <List sx={{ p: 2, mt: 1 }}>
          {menuItems.map((item, index) => {
            if (item.type === "divider") {
              return (
                <Divider
                  key={index}
                  sx={{ opacity: 0.1, mx: 1.5, my: 1.5 }}
                />
              );
            }

            // FACTORIES EXPANDABLE SECTION
            if (item.expandable) {
              return (
               <div key={"factory-section"}>
  <ListItemButton
    onClick={() => navigate("/factories")}   // 👉 Navigate to factories page
    sx={{
      mb: 1.2,
      px: 2,
      py: 1.5,
      borderRadius: "12px",
      backgroundColor: alpha("#3b82f6", 0.1),
      "&:hover": { backgroundColor: alpha("#3b82f6", 0.18) },
      display: "flex",
      alignItems: "center",
    }}
  >
    <ListItemIcon sx={{ color: "#60a5fa" }}>{item.icon}</ListItemIcon>

    <ListItemText
      primary="Factories"
      primaryTypographyProps={{
        fontWeight: 600,
        color: "#60a5fa",
      }}
    />

    {/* Expand/Collapse Arrow */}
    <div
      onClick={(e) => {
        e.stopPropagation(); // prevents triggering navigation
        handleFactoryToggle();
      }}
    >
      {factoryOpen ? <ExpandLess /> : <ExpandMore />}
    </div>
  </ListItemButton>

  {/* Dynamic Factory List */}
  <Collapse in={factoryOpen} timeout="auto" unmountOnExit>
    <List component="div" disablePadding>
      {factories.map((factory) => {
        const path = `/factory/${factory.id}`;
        const isActive = isActiveRoute(path);

        return (
          <motion.div
            key={factory.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ borderRadius: "12px" }}
          >
            <ListItemButton
              sx={{
                ml: 4,
                mb: 1,
                borderRadius: "10px",
                backgroundColor: isActive
                  ? alpha("#3b82f6", 0.18)
                  : "transparent",
                "&:hover": { backgroundColor: alpha("#3b82f6", 0.12) },
              }}
              onClick={() => navigate(path)}
            >
              <ListItemText
                primary={factory.name}
                primaryTypographyProps={{
                  color: isActive ? "#60a5fa" : "rgba(226,232,240,0.7)",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </motion.div>
        );
      })}
    </List>
  </Collapse>
</div>
              );
            }

            // REGULAR MENU ITEM
            const isActive = isActiveRoute(item.path);

            return (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: "12px" }}
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mb: 1.2,
                    px: 2,
                    py: 1.5,
                    borderRadius: "12px",
                    backgroundColor: isActive
                      ? alpha("#3b82f6", 0.18)
                      : "transparent",
                    borderLeft: isActive
                      ? "4px solid #60a5fa"
                      : "4px solid transparent",
                    "&:hover": {
                      backgroundColor: alpha("#3b82f6", 0.12),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#60a5fa" : "rgba(226,232,240,0.7)",
                      minWidth: 40,
                      transition: "0.25s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      color: isActive
                        ? "#60a5fa"
                        : "rgba(226,232,240,0.75)",
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  />
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
