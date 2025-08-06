import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Typography,
  Container,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";

// Helper for fetching paginated Laravel API
const fetchPaginated = async (url) => {
  let allItems = [];
  let nextUrl = url;

  while (nextUrl) {
    const res = await axios.get(nextUrl);
    const { data, next_page_url } = res.data;
    allItems = [...allItems, ...data];
    nextUrl = next_page_url;
  }

  return allItems;
};

const StatCard = ({ icon, title, value, gradient }) => (
  <Card
    sx={{
      p: 3,
      background: gradient,
      borderRadius: 3,
      color: "white",
      boxShadow: 3,
      transition: "transform 0.3s ease",
      "&:hover": { transform: "scale(1.03)" },
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box>{icon}</Box>
      <Box>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Box>
  </Card>
);

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch teacher details 
        const teacherRes = await axios.get("/my-detail");
        const teacherData = teacherRes.data;
        setTeacher(teacherData);

        // Fetch teacher's students 
        const studentsList = await fetchPaginated("/my-students");
        setStudents(studentsList);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const teacherInitial =
    teacher?.user?.first_name?.charAt(0).toUpperCase() || "T";

  return (
    <Container sx={{ mt: 5, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {teacher?.user?.first_name} {teacher?.user?.last_name}
      </Typography>

      {/* Teacher Profile */}
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(to right, #2196f3, #6ec6ff)",
          color: "white",
        }}
      >
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mr: 2,
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 700,
          }}
        >
          {teacherInitial}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {teacher?.user?.first_name} {teacher?.user?.last_name}
          </Typography>
          <Typography variant="body2">Employee ID: {teacher?.employee_id || "N/A"}</Typography>
          <Typography variant="body2">Email: {teacher?.user?.email}</Typography>
          <Typography variant="body2">Phone: {teacher?.phone}</Typography>
          <Typography variant="body2">Subject: {teacher?.subject_specialization}</Typography>
          <Typography variant="body2">Joined: {teacher?.date_of_joining}</Typography>
        </Box>
      </Paper>

      {/* Stats */}
      <Typography variant="h6" gutterBottom>
        Students Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Students"
            value={students.length}
            icon={<GroupIcon sx={{ fontSize: 40 }} />}
            gradient="linear-gradient(to right, #66bb6a, #43a047)"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TeacherDashboard;
