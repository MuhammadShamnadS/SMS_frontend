import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  IconButton,
  Grid,
  Card,
  CardContent,
  Avatar,
  Divider,
  Stack,
  useTheme,
  Pagination,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Class as ClassIcon,
  AssignmentInd as AssignmentIndIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";
import axios from "../../../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const StudentsUnderTeacher = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
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
          <Grid container spacing={3}>
            {students.map((student) => (
              <Grid item xs={12} sm={6} md={4} key={student.id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    p: 2,
                    background: theme.palette.background.paper,
                    boxShadow: 2,
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 5,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {student.user?.first_name} {student.user?.last_name}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      <Box display="flex" alignItems="center" gap={1}>
                        <BadgeIcon fontSize="small" />
                        <Typography variant="body2">
                          Roll No: {student.roll_number}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <ClassIcon fontSize="small" />
                        <Typography variant="body2">
                          Class: {student.student_class}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{student.user?.email}</Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{student.phone}</Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <AssignmentIndIcon fontSize="small" />
                        <Typography variant="body2">Status: {student.status}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

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
        </>
      )}
    </Container>
  );
};

export default StudentsUnderTeacher;
