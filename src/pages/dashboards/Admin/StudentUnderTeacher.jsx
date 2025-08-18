import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Card,
  Button,
  Avatar,
  Divider,
  Stack,
  useTheme,
  Pagination,
  Tooltip,
  Skeleton,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  
} from "@mui/material";
import {
  Visibility as Visibility,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,Email,
  Phone as PhoneIcon,Phone,
  Class as ClassIcon,Class,
  AssignmentInd as AssignmentIndIcon,
  Badge,
  Cake,
  CalendarMonth,
  AccountCircle,
} from "@mui/icons-material";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";


const StudentsUnderTeacher = () => {
  
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = theme.breakpoints.down("sm");

  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const perPage = 5;

const fetchStudents = async (pageNum = 1) => {
  setLoading(true);
  try {
    const res = await axios.get(`/teachers/${teacherId}/students?page=${pageNum}&per_page=${perPage}`);
    setStudents(res.data.data || []); 
    setTotalPages(res.data.last_page);
  } catch (err) {
    setError("Failed to fetch students");
  } finally {
    setLoading(false);
  }
};

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`/teachers/${teacherId}`);
      setTeacher(res.data);
    } catch (err) {
      console.error("Could not load teacher");
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [teacherId]);

  useEffect(() => {
    fetchStudents(page);
  }, [page, teacherId]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <Tooltip title="Go back">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h5" fontWeight="bold">
          Students Under {teacher?.user?.first_name || "Teacher"}
        </Typography>
      </Box>

      {/* Teacher Info */}
      {teacher ? (
        <Card
          sx={{
            mb: 5,
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.secondary.light})`,
            boxShadow: 6,
            color: "white",
          }}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "white", color: "black", fontWeight: "bold" }}>
              {teacher.user?.first_name?.[0] || "T"}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {teacher.user?.first_name} {teacher.user?.last_name}
              </Typography>
              <Stack spacing={1} mt={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ClassIcon fontSize="small" />
                  <Typography variant="body2">{teacher.assigned_class}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <EmailIcon fontSize="small" />
                  <Typography variant="body2">{teacher.user?.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="body2">{teacher.phone}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ClassIcon fontSize="small" />
                  <Typography variant="body2">{teacher.subject_specialization}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AssignmentIndIcon fontSize="small" />
                  <Typography variant="body2">Employee ID: {teacher.employee_id}</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Card>
      ) : (
        <Skeleton height={120} variant="rounded" sx={{ mb: 4 }} />
      )}

      {/* Loading / Error / No Students */}
      {loading && (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && students.length === 0 && (
        <Alert severity="info">No students assigned to this teacher.</Alert>
      )}

      {/* Students */}
      {!loading && !error && students.length > 0 && (
        <>
                <Paper  elevation={4} sx={{ p: 2, borderRadius: 3, overflowX: "auto", minHeight: 250 }}>
        {
        loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={150}>
            <CircularProgress/>
            </Box>
        ) : (
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Class</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Roll No.</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
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
                          <IconButton size="small" color="info" onClick={() => setSelectedStudent(student)}>
                            <Visibility fontSize="small" />
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
          <Box mt={5} display="flex" justifyContent="center">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
     
        {/* Student Details Modal */}
              {selectedStudent && (
                <Dialog open onClose={() => setSelectedStudent(null)} fullWidth maxWidth="sm">
                  <DialogTitle fontWeight="bold">Student Profile</DialogTitle>
                  <DialogContent dividers>
                    <Box display="grid" gridTemplateColumns="1fr" gap={1.5}>
                      <Divider />
                      <Box display="flex" alignItems="center" gap={1}><AccountCircle color="primary" /><Typography variant="body1" fontWeight="medium">{selectedStudent.user.first_name} {selectedStudent.user.last_name}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><Email color="action" /><Typography variant="body2">{selectedStudent.user.email}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><Phone color="action" /><Typography variant="body2">{selectedStudent.phone}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><Class color="action" /><Typography variant="body2">Class: {selectedStudent.student_class}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><Badge color="action" /><Typography variant="body2">Roll No: {selectedStudent.roll_number}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><Chip label={selectedStudent.status} color={selectedStudent.status === "active" ? "success" : "default"} size="small" /></Box>
                      <Divider />
                      <Box display="flex" alignItems="center" gap={1}><Cake fontSize="small" /><Typography variant="body2">DOB: {selectedStudent.date_of_birth}</Typography></Box>
                      <Box display="flex" alignItems="center" gap={1}><CalendarMonth fontSize="small" /><Typography variant="body2">Admission Date: {selectedStudent.admission_date}</Typography></Box>
                    </Box>
                  </DialogContent>
                  <Box display="flex" justifyContent="flex-end" p={2}>
                    <Button variant="outlined" onClick={() => setSelectedStudent(null)}>Close</Button>
                  </Box>
                </Dialog>
              )}
                </>
      )}
    </Container>
  );
};

export default StudentsUnderTeacher;
