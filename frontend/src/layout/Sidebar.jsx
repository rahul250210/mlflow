import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Toolbar } from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

const drawerWidth = 240;

export default function Sidebar({ children }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: { width: drawerWidth },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => navigate("/")}>
            <ListItemIcon>
              <FactoryIcon />
            </ListItemIcon>
            <ListItemText primary="Factories" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
