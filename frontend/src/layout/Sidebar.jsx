import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar } from "@mui/material"
import FactoryIcon from "@mui/icons-material/Factory"
import { useNavigate } from "react-router-dom"
import Topbar from "./Topbar"
import { alpha } from "@mui/material/styles"

const drawerWidth = 260

export default function Sidebar({ children }) {
  const navigate = useNavigate()

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            backgroundColor: "#0f172a",
            borderRight: "1px solid rgba(226, 232, 240, 0.1)",
            boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Toolbar />
        <List sx={{ px: 1.5, pt: 2 }}>
          <ListItem
            button
            onClick={() => navigate("/")}
            sx={{
              borderRadius: 2,
              mb: 1,
              transition: "all 0.2s ease",
              color: "rgba(226, 232, 240, 0.7)",
              "&:hover": {
                backgroundColor: alpha("#3b82f6", 0.1),
                color: "#3b82f6",
              },
              "&.active": {
                backgroundColor: alpha("#3b82f6", 0.15),
                color: "#3b82f6",
                borderLeft: "3px solid #3b82f6",
                paddingLeft: "calc(1rem - 3px)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <FactoryIcon />
            </ListItemIcon>
            <ListItemText
              primary="Factories"
              sx={{ "& .MuiTypography-root": { fontWeight: 600, fontSize: "0.95rem" } }}
            />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f8fafc" }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  )
}
