// src/layout/Topbar.jsx
"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.35)",
      }}
    >
      <Toolbar sx={{ py: 1.5, px: 3 }}>
        {/* Left Title */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: "-0.6px",
            background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #c084fc 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0px 2px 6px rgba(99,102,241,0.35))",
          }}
        >
          Factory Portal
        </Typography>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Notifications Icon */}
          <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              sx={{
                backgroundColor: alpha("#94a3b8", 0.08),
                border: "1px solid rgba(148,163,184,0.15)",
                backdropFilter: "blur(6px)",
                "&:hover": {
                  backgroundColor: alpha("#94a3b8", 0.18),
                },
                transition: "0.25s ease",
              }}
            >
              <NotificationsNoneIcon sx={{ color: "#cbd5e1", fontSize: 22 }} />
            </IconButton>
          </motion.div>

          {/* Profile Section */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 250 }}
            style={{ cursor: "pointer" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.7,
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(10px)",
                transition: "0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  fontSize: 16,
                  background: "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
                }}
              >
                R
              </Avatar>

              <Typography
                sx={{
                  fontWeight: 600,
                  color: "#e2e8f0",
                  fontSize: "0.9rem",
                }}
              >
                Rahul
              </Typography>

              <KeyboardArrowDownIcon sx={{ color: "#e2e8f0", fontSize: 20 }} />
            </Box>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
