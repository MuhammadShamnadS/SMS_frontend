import React, { useState } from "react";
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
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

const TeacherRegisterForm = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError, 
    formState: { errors },
  } = useForm();

  // Register Teacher API Call
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
      subject_specialization: data.subject_specialization,
      employee_id: data.employee_id,
      status: data.status,
      date_of_joining: data.date_of_joining,
    };

    try {
      await axios.post(`/register/teacher`, payload);
      setSuccess("Teacher registered successfully!");
      reset();
  } catch (err) {
  const serverErrors = err.response?.data;

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
    setFormError("Teacher registration failed. Please try again.");
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
          <Typography variant="h6">Register Teacher</Typography>
          <Stack direction="row" spacing={2}>
            
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard/teachers")}
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


        {/* 🔹 Teacher Registration Form */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField fullWidth label="Username" margin="normal" {...register("username",{ required: "Username is required"})} error={!!errors.username} helperText={errors.username?.message} />
          <TextField fullWidth label="Email" margin="normal" {...register("email", { required: "Email is required" })} error={!!errors.email} helperText={errors.email?.message} />
          <TextField fullWidth label="First Name" margin="normal" {...register("first_name", { required: "First name is required" })} error={!!errors.first_name} helperText={errors.first_name?.message} />
          <TextField fullWidth label="Last Name" margin="normal" {...register("last_name")} error={!!errors.last_name} helperText={errors.last_name?.message} />
          <TextField fullWidth label="Password" type="password" margin="normal" {...register("password", { required: "Password is required" })} error={!!errors.password} helperText={errors.password?.message} />
          <TextField fullWidth label="Phone" margin="normal" {...register("phone", { required: "Phone is required" })} error={!!errors.phone} helperText={errors.phone?.message} />
          <TextField fullWidth label="Subject Specialization" margin="normal" {...register("subject_specialization", { required: "Subject is required" })} error={!!errors.subject_specialization} helperText={errors.subject_specialization?.message} />
          <TextField fullWidth label="Employee ID" margin="normal"  {...register("employee_id", { required: "Employee ID is required" })} error={!!errors.employee_id} helperText={errors.employee_id?.message} />
          <TextField fullWidth label="Date of Joining" type="date" margin="normal" InputLabelProps={{ shrink: true }} {...register("date_of_joining", { required: "Date of joining is required" })} error={!!errors.date_of_joining} helperText={errors.date_of_joining?.message} />
          <TextField fullWidth label="Status" margin="normal" defaultValue="active" {...register("status")} />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, p: 1.2, fontWeight: "bold" }}>
            Register Teacher
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherRegisterForm;