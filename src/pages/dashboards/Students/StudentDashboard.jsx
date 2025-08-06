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

const StudentDashboard = () => {
  const [student, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details 
        const studentRes = await axios.get("/my-details");
        const studentData = studentRes.data;
        setStudents(studentData);
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


  return (
    <Container sx={{ mt: 5, mb: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome, {student?.user?.first_name} {student?.user?.last_name}
      </Typography>

      {/* Student Profile */}
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
        </Avatar>
        <Box>
          <Typography variant="h6">
            {student?.user?.first_name} {student?.user?.last_name}
          </Typography>
          <Typography variant ="body2">User name: {student?.user?.username || "N/A"}</Typography>
          <Typography variant="body2">Roll no: {student?.roll_number || "N/A"}</Typography>
          <Typography variant="body2">Email: {student?.user?.email}</Typography>
          <Typography variant="body2">Phone: {student?.phone}</Typography>
          <Typography variant="body2">Class: {student?.student_class}</Typography>
          <Typography variant="body2">Joined: {student?.admission_date}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;
