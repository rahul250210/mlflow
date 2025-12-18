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
  Popover,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  alpha,
  Paper,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const [notifications, setNotifications] = useState([]);
  const [snack, setSnack] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileMenu, setProfileMenu] = useState(null);

  const navigate = useNavigate();

  // ------------------ USER ------------------
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user?.name || "Guest";

  // ------------------ WEBSOCKET ------------------
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/notifications");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setNotifications((prev) => [data, ...prev]);
      setSnack(data.message);

      window.dispatchEvent(new Event("factory-updated"));
    };

    return () => ws.close();
  }, []);

  const openNotif = Boolean(anchorEl);
  const openProfile = Boolean(profileMenu);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 2,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ py: 1.3, px: 3 }}>
          {/* TITLE */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              flexGrow: 1,
              letterSpacing: 0.5,
              background:
                "linear-gradient(135deg, #60a5fa, #a78bfa, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            NexusForge
          </Typography>

          {/* RIGHT SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* NOTIFICATIONS BUTTON */}
            <Tooltip title="Notifications">
              <motion.div whileHover={{ scale: 1.15 }}>
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{
                    backgroundColor: alpha("#94a3b8", 0.1),
                    border: "1px solid rgba(148,163,184,0.18)",
                  }}
                >
                  <Badge badgeContent={notifications.length} color="error">
                    <NotificationsNoneIcon
                      sx={{ color: "#e2e8f0", fontSize: 22 }}
                    />
                  </Badge>
                </IconButton>
              </motion.div>
            </Tooltip>

            {/* PROFILE DROPDOWN */}
            <motion.div whileHover={{ scale: 1.03 }}>
              <Paper
                elevation={0}
                sx={{
                  px: 1.8,
                  py: 0.6,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: "16px",
                  cursor: "pointer",
                  bgcolor: "rgba(255,255,255,0.05)",
                  transition: "0.2s",
                  ":hover": {
                    bgcolor: "rgba(255,255,255,0.09)",
                  },
                }}
                onClick={(e) => setProfileMenu(e.currentTarget)}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#6366f1",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {username[0].toUpperCase()}
                </Avatar>
                <Typography sx={{ fontWeight: 600, color: "white" }}>
                  {username}
                </Typography>
                <KeyboardArrowDownIcon sx={{ color: "white" }} />
              </Paper>
            </motion.div>
          </Box>
        </Toolbar>
      </AppBar>

      {/* NOTIFICATION POP */}
      <Popover
        open={openNotif}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Box sx={{ width: 350 }}>
          <Typography
            sx={{
              p: 2,
              fontWeight: 700,
              backgroundColor: alpha("#e5e7eb", 0.4),
            }}
          >
            Notifications
          </Typography>

          <List dense sx={{ maxHeight: 260, overflow: "auto" }}>
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications yet" />
              </ListItem>
            )}

            {notifications.map((n, i) => (
              <ListItem key={i} divider>
                <ListItemText
                  primary={n.message}
                  secondary={n.type}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>

      {/* USER MENU */}
      <Menu
        anchorEl={profileMenu}
        open={openProfile}
        onClose={() => setProfileMenu(null)}
        PaperProps={{
          elevation: 4,
          sx: {
            width: 200,
            borderRadius: 3,
            overflow: "hidden",
            py: 1,
          },
        }}
      >
        <MenuItem disabled>
          <AccountCircleIcon sx={{ mr: 1 }} />
          {user?.email}
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={() => navigate("/settings")}>
          <SettingsIcon sx={{ mr: 1 }} />
          Settings
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "#ef4444",
            fontWeight: 600,
            ":hover": {
              bgcolor: alpha("#ef4444", 0.08),
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* SNACKBAR */}
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
      >
        <Alert severity="info" variant="filled">
          {snack}
        </Alert>
      </Snackbar>
    </>
  );
}
