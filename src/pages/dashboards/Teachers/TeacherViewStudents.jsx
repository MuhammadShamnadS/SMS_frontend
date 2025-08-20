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
  Dialog,
  DialogTitle,
  DialogContent,
  TableHead,
  TableRow,
  Button,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatWindow from "../../../components/chat/ChatWindow";
import CloseIcon from "@mui/icons-material/Close";

const MyStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [chatWith, setChatWith] = useState(null);
  const [chatMode, setChatMode] = useState(false); 

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

    const handleView = (student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handlePageChange = (event, value) => setPage(value);

  const me = JSON.parse(localStorage.getItem("user"));

  if (loading) return <CircularProgress sx={{ mt: 10 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mt: 4, mb: 3, fontWeight: "bold" }}>
        Assigned Students
      </Typography>

      {!chatMode ? (
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
                        {`${student.user.first_name} ${
                          student.user.last_name ?? ""
                        }`}
                      </TableCell>
                      <TableCell>{student.student_class}</TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          gap: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* View details */}
                        <Button
                        onClick={() => handleView(student)}
                          variant="text"
                          size="small"
                          sx={{
                            color: "black",
                            ml: 1,
                            borderRadius: "500px",
                            "&:hover": {
                              backgroundColor: "#444444d8",
                              color: "white",
                            },
                            fontWeight: 500,
                          }}
                        >
                          <VisibilityIcon />
                        </Button>

                        {/* Open chat */}
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => {
                            setChatWith(student);
                            setChatMode(true);
                          }}
                          sx={{
                            color: "black",
                            ml: 1,
                            borderRadius: "500px",
                            "&:hover": {
                              backgroundColor: "#444444d8",
                              color: "white",
                            },
                            fontWeight: 500,
                          }}
                        >
                          <ChatOutlinedIcon sx={{ mr: 0.5 }} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
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

          {/* Laravel Pagination */}
          {count > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={count}
                page={page}
                onChange={handlePageChange}
                color="black"
              />
            </Box>

            
          )}
        </Paper>
        
      ) : (
        <Box display="flex" gap={2}>
          {/* Student List */}
          <Paper
            elevation={3}
            sx={{
              flex: "0 0 250px",
              borderRadius: 3,
              overflowY: "auto",
              maxHeight: "75vh",
            }}
          >
            <List>
              {students.map((student) => (
                <ListItemButton
                  key={student.id}
                  selected={chatWith?.id === student.id}
                  onClick={() => setChatWith(student)}
                >
                  <ListItemText
                    primary={`${student.user.first_name} ${
                      student.user.last_name ?? ""
                    }`}
                    secondary={`Roll : ${student.roll_number} |
                    Class : ${student.student_class}`}
        primaryTypographyProps={{ fontWeight: 600 }}
        secondaryTypographyProps={{ color: "text.secondary", fontSize: "0.85rem" }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>

          {/* Chat Window */}
          <Box flex="1">
            {chatWith && (
              <ChatWindow
                me={me}
                peerId={chatWith.user.id}
                peerName={`${chatWith.user.first_name} ${
                  chatWith.user.last_name ?? ""
                }`}
                onClose={() => {
                  setChatWith(null);
                  setChatMode(false);
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default MyStudents;
