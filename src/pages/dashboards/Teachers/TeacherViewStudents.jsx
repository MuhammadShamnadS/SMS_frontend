// src/pages/dashboard/teacher/MyStudents.jsx
import React, { useEffect, useState } from "react";
import axios from "../../../api/axios";
import {
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatWindow from "../../../components/chat/ChatWindow"; 
import CloseIcon from "@mui/icons-material/Close";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  // modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // chat modal
  const [chatWith, setChatWith] = useState(null);

  // Fetch students with Laravel pagination
  const fetchStudents = (pageNumber) => {
    setLoading(true);
    axios
      .get(`/my-students?page=${pageNumber}`)
      .then((res) => {
        const { data, total, per_page } = res.data;
        setStudents(data || []);
        setCount(Math.ceil(total / per_page));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load students");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // logged-in teacher (from localStorage, saved during login)
  const me = JSON.parse(localStorage.getItem("user"));

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Assigned Students
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Class</strong></TableCell>
                <TableCell><strong>Roll No</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No students assigned.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      {`${student.user.first_name} ${student.user.last_name ?? ""}`}
                    </TableCell>
                    <TableCell>{student.student_class}</TableCell>
                    <TableCell>{student.roll_number}</TableCell>
                    <TableCell align="center"
                      sx={{ gap: 1, display: "flex", justifyContent: "center" }}>
                      {/* View details */}
                      <Button
                      variant="text"
                      size="small"
                        color="black"
                        onClick={() => handleView(student)}
                        sx={{ ml: 1 ,borderRadius:"500px",
                "&:hover": { backgroundColor: "#444444d8" , color: "white" },
                fontWeight: 500,}}
                      >
                        <VisibilityIcon />
                      </Button>

                      {/* Open chat */}
                      <Button
                        variant="text"
                        size="small"
                        
                        color="black"
                        onClick={() => setChatWith(student)}
                        sx={{ ml: 1 ,borderRadius:"500px",
                "&:hover": { backgroundColor: "#444444d8" , color: "white" },
                fontWeight: 500,}}
                      >
                        <ChatOutlinedIcon />
                        Chat
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Laravel Pagination */}
      {count > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={count}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Student Details Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <Box 
        display="flex"
        felxDirection="column"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#444444"
        color="white">
        <DialogTitle>Student Details</DialogTitle>
                  <Button 
                  sx={{
                    marginRight: "10px",
                    borderRadius: "100px",
                    background: "#444444",
                    color: "white",
                    "&:hover": { backgroundColor: "#302f2fb0" },
                    fontWeight: 500,
                  }}
            onClick={handleCloseModal}
            color="black"
            variant="text"
          >
            <CloseIcon/>
            Close
          </Button>
          </Box>
        <DialogContent dividers>
          {selectedStudent && (
            <Box>
              <Typography variant="body1">
                <strong>Username:</strong> {selectedStudent.user.username}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {selectedStudent.user.first_name}{" "}
                {selectedStudent.user.last_name}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedStudent.user.email}
              </Typography>
              <Typography variant="body1">
                <strong>Roll Number:</strong> {selectedStudent.roll_number}
              </Typography>
              <Typography variant="body1">
                <strong>Class:</strong> {selectedStudent.student_class}
              </Typography>
              <Typography variant="body1">
                <strong>Phone no:</strong> {selectedStudent.phone}
              </Typography>
              <Typography variant="body1">
                <strong>DOB:</strong> {selectedStudent.date_of_birth}
              </Typography>
              <Typography variant="body1">
                <strong>Admission Date:</strong>{" "}
                {selectedStudent.admission_date}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog
        open={!!chatWith}
        onClose={() => setChatWith(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
    sx: {
      background: "#222",   // remove white background
      boxShadow: "none",           // remove default shadow
    },
  }}
      >


          {chatWith && (
            <ChatWindow me={me} peerId={chatWith.user.id} 
            onClose={() => setChatWith(null)}
            />
          )}
      </Dialog>
    </Container>
  );
};

export default MyStudents;
