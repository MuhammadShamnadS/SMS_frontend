import React, { useContext, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  Box,
  ListItemButton,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { AuthContext } from "../context/AuthContext";
import { grey } from "@mui/material/colors";

const drawerWidth = 200;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = {
    admin: [
      { label: "Home", path: "/dashboard" },
      { label: "List Teachers", path: "/dashboard/teachers" },
      { label: "List Students", path: "/dashboard/students" },
    ],
    teacher: [
      { label: "Home", path: "/dashboard" },
      { label: "My Students", path: "/dashboard/teachers/student"},

    ],
    student: [
      { label: "Dashboard", path: "/dashboard" },
    ],

  };

  const links = navItems[user?.role] || [];

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = (
    <Box sx={{ 
      bgcolor: "#929292ff",
      height: "100%",
      width: drawerWidth }}>
      <Toolbar />
     
      <List>
        {links.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              School Management System
            </Typography>
          </Box>
          <LogoutButton />
        </Toolbar>
      </AppBar>


      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>

        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              width: 20,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                top: "20px",
              },
            }}
          >
            {drawer}
          </Drawer>
        )}


        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
            ml: isMobile ? 0 : `${drawerWidth}px`,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          bgcolor: "#929292be",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          p: 2,
          mt: "auto",
          ml: isMobile ? 0 : `${drawerWidth}px`,
          width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} School Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
