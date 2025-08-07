import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

const StudentRegisterForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState([]);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();



  //Fetch Teachers for dropdown
useEffect(() => {
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/teachers");
      setTeachers(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      setTeachers([]); 
    }
  };
  fetchTeachers();
}, []);


  //  Register Student API Call
  const onSubmit = async (data) => {
    setFormError("");
    setSuccess("");

    const payload = {
      username: data.username,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      phone: data.phone,
      roll_number: data.roll_number,
      student_class: data.student_class,
      date_of_birth: data.date_of_birth,
      admission_date: data.admission_date,
      status: data.status,
      assigned_teacher_id: data.assigned_teacher_id || null,
    };

    try {
      await axios.post("/register/student", payload);
      setSuccess("Student registered successfully!");
      reset();
    } catch (err) {
    const serverErrors = err.response?.data?.errors || err.response?.data;

    if (serverErrors) {
      Object.keys(serverErrors).forEach((field) => {
        setError(field, {
          type: "manual",
          message: Array.isArray(serverErrors[field])
            ? serverErrors[field][0]
            : serverErrors[field],
        });
      });
    } else {
      setFormError("Student registration failed. Please try again.");
    }
  }
};
  
  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        {/* 🔹 Header Bar */}
        <Box
          sx={{
            background: "linear-gradient(to right, #1976d2, #42a5f5)",
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h6">Register Student</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard/students")}
              variant="outlined"
              sx={{
                backgroundColor: "#fff",
                color: "#1976d2",
                "&:hover": { backgroundColor: "#e3f2fd" },
                fontWeight: 600,
              }}
            >
              Back
            </Button>
          </Stack>
        </Box>

        {/* 🔹 Alerts */}
        {formError && (
          <Alert severity="error" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            {formError}
          </Alert>
        )}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/*Student Registration Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>

        
        <TextField fullWidth label="Username" margin="normal"{...register("username", 
        {
            required: "Username is required",
            minLength: { value: 3, message: "Username must be at least 3 characters",},
            maxLength: {value: 255, message: "Username must be at most 255 characters",},
            pattern: {value: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores",},
          })}error={!!errors.username} helperText={errors.username?.message}/>       


        <TextField fullWidth label="Email" margin="normal" {...register("email", 
          { 
            required: "Email is required",
            pattern: { value: emailRegex, message: "Invalid Email format",},
          })} error={!!errors.email} helperText={errors.email?.message} />

          <TextField fullWidth label="First Name" margin="normal" {...register("first_name", 
            { 
              required: "First name is required",
              minLength: { value: 2, message: "First name must be minimum 2 characters"},
              maxLength: { value: 255, message: "First name must be atmost 255 characters" },
              pattern: { value: /^[A-Za-z ]+$/, message: "Name only contains alphabets"}
             })} error={!!errors.first_name} helperText={errors.first_name?.message} />

          <TextField fullWidth label="Last Name" margin="normal" {...register("last_name",
          {
            pattern: { value: /^[A-Za-z ]+$/, message: "Name only contains alphabets"}
          })} error={!!errors.last_name} helperText={errors.last_name?.message} />

          <TextField fullWidth label="Password" type="password" margin="normal" {...register("password", 
          { 
            required: "Password is required",
            minLength: { value: 6, message:"Password must contains 6 characters"}
          })} error={!!errors.password} helperText={errors.password?.message} />

            <TextField fullWidth label="Phone" margin="normal" {...register("phone", 
            { 
              required: "Phone is required",
              pattern: { value: /^[0-9]{10}$/, message: "Phone number must be exactly 10 digits"},
            })} error={!!errors.phone} helperText={errors.phone?.message} />

          <TextField fullWidth label="Roll No" margin="normal" {...register("roll_number", 
            { 
              required: "Roll number is required" ,
                  minLength: { value: 1, message: "Please enter a roll number",},
                  pattern: { value: /^[0-9]+$/, message: "Roll number only contains digits"}
            })} error={!!errors.roll_number} helperText={errors.roll_number?.message} />

          <TextField fullWidth type="date" label="Date of Birth" InputLabelProps={{ shrink: true }} margin="normal" {...register("date_of_birth", { required: "Date of birth is required" })} error={!!errors.date_of_birth} helperText={errors.date_of_birth?.message} />
          <TextField fullWidth type="date" label="Admission Date" InputLabelProps={{ shrink: true }} margin="normal" {...register("admission_date", { required: "Admission date is required" })} error={!!errors.admission_date} helperText={errors.admission_date?.message} />

          {/*Class Dropdown */}
          <FormControl fullWidth margin="normal" error={!!errors.student_class}>
            <InputLabel>Class</InputLabel>
            <Select defaultValue="" {...register("student_class", { required: "Class is required" })}>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>Class {i + 1}</MenuItem>
              ))}
            </Select>
            {errors.student_class && <p style={{ color: "red", marginTop: 4 }}>{errors.student_class.message}</p>}
          </FormControl>

          {/*Status Dropdown */}
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select defaultValue="active" {...register("status", { required: "Status is required" })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            {errors.status && <p style={{ color: "red", marginTop: 4 }}>{errors.status.message}</p>}
          </FormControl>

          {/*Assign Teacher Dropdown */}
          <FormControl fullWidth margin="normal" error={!!errors.assigned_teacher_id}>
            <InputLabel>Assign Teacher</InputLabel>
            <Select defaultValue="" {...register("assigned_teacher_id")}>
              <MenuItem value="">None</MenuItem>
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.user.first_name} {t.user.last_name} ({t.subject_specialization})
                </MenuItem>
              ))}
            </Select>
            {errors.assigned_teacher_id && <p style={{ color: "red", marginTop: 4 }}>{errors.assigned_teacher_id.message}</p>}
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, p: 1.2, fontWeight: "bold" }}
            startIcon={<SchoolIcon />}
          >
            Register Student
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentRegisterForm;
