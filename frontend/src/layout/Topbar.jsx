// src/layout/Topbar.jsx
"use client";

import { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";

export default function Topbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // 🔔 Listen for notifications
  useEffect(() => {
    const handler = (e) => {
      setNotifications((prev) => [e.detail, ...prev].slice(0, 10));
    };

    window.addEventListener("app-notification", handler);
    return () => window.removeEventListener("app-notification", handler);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backdropFilter: "blur(20px)",
        backgroundColor: "rgba(15, 23, 42, 0.65)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ py: 1.5, px: 3 }}>
        {/* LEFT */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #60a5fa, #a78bfa, #c084fc)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NexusForge
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "rgba(226,232,240,0.7)",
            }}
          >
            Where factories, algorithms and models converge
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* 🔔 NOTIFICATIONS */}
          <motion.div whileHover={{ scale: 1.15 }}>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                backgroundColor: alpha("#94a3b8", 0.08),
                border: "1px solid rgba(148,163,184,0.15)",
              }}
            >
              <Badge
                badgeContent={notifications.length}
                color="error"
              >
                <NotificationsNoneIcon
                  sx={{ color: "#cbd5e1", fontSize: 22 }}
                />
              </Badge>
            </IconButton>
          </motion.div>

          {/* NOTIFICATION MENU */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                width: 320,
                borderRadius: "14px",
                background: "#020617",
                color: "#e5e7eb",
              },
            }}
          >
            <Typography sx={{ px: 2, py: 1, fontWeight: 700 }}>
              Notifications
            </Typography>
            <Divider sx={{ opacity: 0.15 }} />

            {notifications.length === 0 && (
              <MenuItem sx={{ opacity: 0.6 }}>
                No notifications yet
              </MenuItem>
            )}

            {notifications.map((n) => (
              <MenuItem key={n.id} sx={{ whiteSpace: "normal" }}>
                <Box>
                  <Typography fontWeight={600}>
                    {n.message}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", opacity: 0.6 }}>
                    {n.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}

            {notifications.length > 0 && (
              <>
                <Divider sx={{ opacity: 0.15 }} />
                <MenuItem
                  onClick={() => setNotifications([])}
                  sx={{ justifyContent: "center", color: "#60a5fa" }}
                >
                  Clear all
                </MenuItem>
              </>
            )}
          </Menu>

          {/* PROFILE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.7,
              borderRadius: "14px",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background:
                  "linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)",
              }}
            >
              R
            </Avatar>
            <Typography sx={{ fontWeight: 600, color: "#e2e8f0" }}>
              Rahul
            </Typography>
            <KeyboardArrowDownIcon sx={{ color: "#e2e8f0" }} />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
