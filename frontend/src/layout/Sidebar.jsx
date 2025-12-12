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
} from "@mui/material";

import FactoryIcon from "@mui/icons-material/Factory";
import HubIcon from "@mui/icons-material/Hub";
import SchemaIcon from "@mui/icons-material/Schema";

import { useLocation, useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import Topbar from "./Topbar";
import { motion } from "framer-motion";

const drawerWidth = 260;

export default function Sidebar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Factories", path: "/", icon: <FactoryIcon /> },
    { label: "Algorithms", path: "/algorithms", icon: <HubIcon /> },
    { label: "Models", path: "/models", icon: <SchemaIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />

      {/* Sidebar Drawer */}
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

        {/* Menu List */}
        <List sx={{ p: 2, mt: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

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
                    transition: "0.25s ease",
                    backgroundColor: isActive
                      ? alpha("#3b82f6", 0.18)
                      : "transparent",
                    borderLeft: isActive ? "4px solid #60a5fa" : "4px solid transparent",
                    "&:hover": {
                      backgroundColor: alpha("#3b82f6", 0.12),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#60a5fa" : "rgba(226,232,240,0.7)",
                      minWidth: 40,
                      transition: "0.22s ease",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    sx={{
                      "& .MuiTypography-root": {
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: isActive ? "#60a5fa" : "rgba(226,232,240,0.75)",
                        letterSpacing: "0.4px",
                      },
                    }}
                  />
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>

        <Divider sx={{ opacity: 0.1, mx: 2, my: 2 }} />
      </Drawer>

      {/* Main Content Area */}
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
