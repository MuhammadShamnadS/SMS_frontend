import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Typography,
  Container,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// StatCard Component remains same
const StatCard = ({ title, value, icon, gradient }) => (
  <Paper
    elevation={4}
    sx={{
      p: 3,
      borderRadius: 3,
      background: gradient,
      color: "#fff",
      transition: "transform 0.3s",
      "&:hover": { transform: "scale(1.05)" },
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, teachers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper: Fetch only the first page and get total count
  const fetchCount = async (endpoint) => {
    const res = await axios.get(endpoint);   
    return res.data.total;                   
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [studentCount, teacherCount ] = await Promise.all([
          fetchCount("/students"),
          fetchCount("/teachers"),
        ]);
        setCounts({ students: studentCount, teachers: teacherCount});
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ mt: 5 }}>
      {/* Admin Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>A</Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">Welcome back, Admin</Typography>
          <Typography variant="body2" color="text.secondary">
            You have full control over the school system.
          </Typography>
        </Box>
      </Box>

      {/* Stat Cards Using Counts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Teachers" value={counts.teachers} icon={<SchoolIcon sx={{ fontSize: 40 }} />} gradient="linear-gradient(to right, #1976d2, #42a5f5)" />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard title="Total Students" value={counts.students} icon={<GroupsIcon sx={{ fontSize: 40 }} />} gradient="linear-gradient(to right, #2e7d32, #66bb6a)" />
        </Grid>
      </Grid>

      {/* Summary Section */}
      <Box mt={5}>
        <Typography variant="h6" sx={{ mb: 1 }}>System Summary</Typography>
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
              <ListItemText primary="All systems are operational." />
            </ListItem>
            <ListItem>
              <ListItemIcon><AccessTimeIcon color="warning" /></ListItemIcon>
              <ListItemText primary="No pending registrations at the moment." />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
