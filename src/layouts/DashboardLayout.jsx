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
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, Outlet } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutButton from "../components/LogoutButton";
import { AuthContext } from "../context/AuthContext";
import { blue } from "@mui/material/colors";

const drawerWidth = 200;

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openRegistration, setOpenRegistration] = useState(false);

  const navItems = {
    admin: [
      { label: "Home", path: "/dashboard" },
      { label: "List Teachers", path: "/dashboard/teachers" },
      { label: "List Students", path: "/dashboard/students" },
      {
        label: "Registration",
        children: [
          { label: "Register Teacher", path: "/dashboard/register/teacher" },
          { label: "Register Student", path: "/dashboard/register/student" },

        ],
      },
    ],
    teacher: [
      { label: "Home", path: "/dashboard" },
      { label: "My Students", path: "/dashboard/teachers/student" },
    ],
    student: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Inbox", path: "/dashboard/student/chat" },

    ]
  };

  const links = navItems[user?.role] || [];

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const drawerContent = (
    <Box sx={{ bgcolor: "#fff", height: "100%", width: drawerWidth }}>
      <Toolbar />
      <List >
        {links.map((item) => {
          if (item.children) {
            return (
              <React.Fragment key={item.label} >
                <ListItemButton  onClick={() => setOpenRegistration((prev) => !prev)} 
                  >
                  <ListItemText primary={item.label} />
                  {openRegistration ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openRegistration} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((sub) => (
                      <ListItemButton
                        key={sub.label}
                        sx={{ pl: 4}}
                        onClick={() => {
                          navigate(sub.path);
                          if (isMobile) setDrawerOpen(false);
                        }}
                      >
                        <ListItemText primary={sub.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          }
          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setDrawerOpen(false);
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Full-width header */}
      <AppBar position="fixed" sx={{ bgcolor: "#444", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center">
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                borderRadius:'100px',
                color: "white",
                "&:hover": { backgroundColor: "#0000002f" }, 
                mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color="white"
              variant="h6"
              noWrap
              sx={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              School Management System
            </Typography>
          </Box>
          <LogoutButton />
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flexGrow: 1, pt: 8 }}>
        {/* Drawer — responsive behavior */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              [`& .MuiDrawer-paper`]: { width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="persistent"
            open={drawerOpen}
            sx={{
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin-left 0.3s",
            ml: !isMobile && drawerOpen ? `${drawerWidth}px` : 0,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: "#ffffffbe",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          p: 2,
          mt: "auto",
          transition: "margin-left 0.3s, width 0.3s",
          ml: !isMobile && drawerOpen ? `${drawerWidth}px` : 0,
          width: !isMobile && drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
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
