// src/layout/Topbar.jsx
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Box from "@mui/material/Box"
import AccountCircle from "@mui/icons-material/AccountCircle"
import { alpha } from "@mui/material/styles"

export default function Topbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        borderBottom: "1px solid rgba(226, 232, 240, 0.1)",
      }}
    >
      <Toolbar sx={{ py: 2 }}>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            fontSize: "1.5rem",
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.5px",
          }}
        >
          Factory Portal
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2" sx={{ color: "rgba(226, 232, 240, 0.8)", fontWeight: 500 }}>
            Admin
          </Typography>
          <IconButton
            color="inherit"
            sx={{
              backgroundColor: alpha("#3b82f6", 0.1),
              "&:hover": {
                backgroundColor: alpha("#3b82f6", 0.2),
              },
              transition: "all 0.2s ease",
            }}
          >
            <AccountCircle sx={{ color: "#3b82f6" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
