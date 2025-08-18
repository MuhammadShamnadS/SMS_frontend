import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Box,
  Paper,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import {
  Edit,
  Delete,
  Visibility,
  Search,
  School,
  Email,
  Phone,
  Badge,
  Class,
  Cake,
  CalendarMonth,
  AccountCircle,
} from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null); 

  const theme = useTheme();
  const isMobile = theme.breakpoints.down("sm");
  const navigate = useNavigate();

  // Fetch students
  const fetchStudents = async (pageNum = 1) => {
  try {
    setLoading(true);
    setError(""); 
    const res = await axios.get(`/students?page=${pageNum}`);
    setStudents(res.data.data || []);
    setCount(res.data.last_page || 1);
  } catch (err) {
    console.error("Fetch students error:", err);
    setError("Failed to fetch students.");
  }finally{
    setLoading(false);
  }
};

useEffect(() => {
  fetchStudents(page);
}, [page]);

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents(page, search);
    } catch {
      alert("Failed to delete student.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box display="flex" bgcolor="#444444" gap={3} p={2} mb={3} justifyContent="space-between" borderRadius={3} boxShadow={3}>
          <Typography variant="h4" color="white" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="white" /> All Students
          </Typography>

          <Stack direction="row"  spacing={2}>
            <Button  variant="text" color="black"  startIcon={<PersonAddAltIcon />} onClick={() => navigate("/dashboard/register/student")}
            sx={{
               
                color: "rgba(255, 255, 255, 1)",
                borderRadius:"100px",
                "&:hover": { backgroundColor: "#00000054" },
                fontWeight: 600,}}
                >
              Register Student
            </Button>
          </Stack>
      </Box>

      {/* Students Table */}
      <Paper elevation={4} sx={{ p: 2, borderRadius: 3, overflowX: "auto", minHeight: 250 }}>
        {
        loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress/>
            </Box>
        ) : (
          
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#444444" }}>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}}>Class</TableCell>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}}>Roll No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" ,color:"white"}} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">No students found.</TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
                    <TableCell>{student.user.email}</TableCell>
                    <TableCell>{student.student_class}</TableCell>
                    <TableCell>{student.roll_number}</TableCell>
                    <TableCell>
                      <Chip label={student.status} color={student.status === "active" ? "success" : "default"} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" color="info" onClick={() => setSelectedStudent(student)} 
                          sx={{
                borderRadius:"100px",
                "&:hover": { backgroundColor: "#00000054" },
                fontWeight: 600,}}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary" component={Link} to={`/dashboard/students/${student.id}/edit`}
                          sx={{
                borderRadius:"100px",
                "&:hover": { backgroundColor: "#00000054" },
                fontWeight: 600,}}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(student.id)} disabled={deletingId === student.id}
                            sx={{
                borderRadius:"100px",
                "&:hover": { backgroundColor: "#00000054" },
                fontWeight: 600,}}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Pagination */}
      {count > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={count} page={page} onChange={(_, val) => setPage(val)} color="primary" shape="rounded" />
        </Box>
      )}

      {/* Student Details Modal */}
     
      {selectedStudent && (
        <Dialog open onClose={() => setSelectedStudent(null)} fullWidth maxWidth="sm">
          <Box display="flex" flexDirection="row" justifyContent="space-between" p={2} height="60px">
        <Typography variant="h6" fontWeight="bold">Student Profile</Typography>
            <IconButton onClick={() => setSelectedStudent(null)}sx={{ color:"black",
                borderRadius:"10px",
                "&:hover": { backgroundColor: "#00000054" },
                fontWeight: 60,}} >
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
          <DialogContent dividers>
            <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
              {/* <Divider /> */}
              <Box display="flex" alignItems="center" gap={1}><AccountCircle color="primary" /><Typography variant="body2" fontWeight="medium">Full name : {selectedStudent.user.first_name} {selectedStudent.user.last_name}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><Email color="action" /><Typography variant="body2">Email : {selectedStudent.user.email}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><Phone color="action" /><Typography variant="body2">Phone no : {selectedStudent.phone}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><Class color="action" /><Typography variant="body2">Class: {selectedStudent.student_class}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><Badge color="action" /><Typography variant="body2">Roll No: {selectedStudent.roll_number}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><Cake fontSize="small" /><Typography variant="body2">DOB: {selectedStudent.date_of_birth}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}><CalendarMonth fontSize="small" /><Typography variant="body2">Admission Date: {selectedStudent.admission_date}</Typography></Box>
              <Box display="flex" alignItems="center" gap={1}>Status : <Chip label={selectedStudent.status} color={selectedStudent.status === "active" ? "success" : "default"} size="small" /></Box>
             <Divider />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
};

export default AllStudents;
