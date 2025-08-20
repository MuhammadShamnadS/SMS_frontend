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
  const [submit,handlesubmit] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


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
            background: "#444444",
            borderRadius: 2,
            p: 2,
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <Typography variant="h6" >Register Teacher</Typography>
          <Stack direction="row" spacing={2}>
            
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/dashboard/teachers")}
              variant="text"
              sx={{
                borderRadius:'100px',
                color: "white",
                "&:hover": { backgroundColor: "#0000002f" },
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


          <TextField fullWidth label="Subject Specialization" margin="normal" {...register("subject_specialization", { required: "Subject is required" })} error={!!errors.subject_specialization} helperText={errors.subject_specialization?.message} />
          <TextField fullWidth label="Employee ID" margin="normal"  {...register("employee_id", { required: "Employee ID is required" })} error={!!errors.employee_id} helperText={errors.employee_id?.message} />
          <TextField fullWidth label="Date of Joining" type="date" margin="normal" InputLabelProps={{ shrink: true }} {...register("date_of_joining", { required: "Date of joining is required" })} error={!!errors.date_of_joining} helperText={errors.date_of_joining?.message} />
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select defaultValue="active" {...register("status", { required: "Status is required" })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
            {errors.status && <p style={{ color: "red", marginTop: 4 }}>{errors.status.message}</p>}
          </FormControl>
          
             <Button type="submit" variant="contained" fullWidth 
                 sx={{
                   marginTop: '10px',
                   borderRadius:'100px',
                   background:"#444444",
                   color: "white",
                   "&:hover": { backgroundColor: "#444444d8" },
                   fontWeight: 600,
                 }}
               >
               Register Teacher
             </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TeacherRegisterForm;