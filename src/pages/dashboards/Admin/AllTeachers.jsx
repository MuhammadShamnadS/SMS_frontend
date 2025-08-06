import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  Chip,
  useMediaQuery,
  IconButton,
  Tooltip,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import axios from "../../../api/axios";

const AllTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Fetch Teachers
  const fetchTeachers = async (pageNum = 1, query) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/teachers?page=${pageNum}`);
      setTeachers(res.data.data || []);
      setCount(res.data.last_page || 1);
    } catch {
      setError("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };


useEffect(() => {
  fetchTeachers(page);
}, [page]);



  // Delete Teacher
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/teachers/${id}`);
      fetchTeachers(page, search);
    } catch {
      alert("Failed to delete teacher");
    } 
  };


  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between"  gap={2} p={2} mb={3} borderRadius={3} boxShadow={3} >
          <Typography variant="h4" fontWeight="bold" display="flex" alignItems="center" gap={1}>
            <SchoolIcon color="primary" /> All Teachers
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<PersonAddAltIcon />} onClick={() => navigate("/dashboard/register/teacher")}>
              Register Teacher
            </Button>
          </Stack>
        </Box>

      {/* Teachers Table */}
      <Paper elevation={4} sx={{ p: 2, borderRadius: 3, overflowX: "auto", minHeight: 250 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>}
                <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
                {!isMobile && <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>}
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center">No teachers found.</TableCell></TableRow>
              ) : (
                teachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell>{teacher.user.first_name} {teacher.user.last_name}</TableCell>
                    {!isMobile && <TableCell>{teacher.user.email}</TableCell>}
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.subject_specialization}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Chip label={teacher.status} size="small" variant="outlined" color={teacher.status === "active" ? "success" : "default"} />
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Students">
                          <IconButton size="small" color="primary" component={Link} to={`/dashboard/teacher/${teacher.id}/students`}>
                            <GroupIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="secondary" component={Link} to={`/dashboard/teachers/${teacher.id}/edit`}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(teacher.id)}>
                            <DeleteIcon />
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
          <Pagination
            count={count}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
            shape="rounded"
            size={isMobile ? "small" : "medium"}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default AllTeachers;
