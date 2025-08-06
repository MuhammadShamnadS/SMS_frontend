// src/pages/dashboards/Students/EditStudentForm.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Stack,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import EventIcon from "@mui/icons-material/Event";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

const EditStudentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setError: setFieldError,watch,
    formState: { errors },
  } = useForm();

  // Fetch student details on mount
  useEffect(() => {
    axios
      .get(`/students/${id}`)
      .then((res) => {
        const s = res.data;
        reset({
          username: s.user.username,
          email: s.user.email,
          first_name: s.user.first_name,
          last_name: s.user.last_name,
          phone: s.phone,
          student_class: s.student_class,
          roll_number: s.roll_number,
          date_of_birth: s.date_of_birth,
          admission_date: s.admission_date,
          status: s.status,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load student data.");
        setLoading(false);
      });
  }, [id, reset]);

  // Close modal and navigate back
  const onClose = () => {
    setOpen(false);
    navigate("/dashboard/students");
  };

  // Submit handler
 const onSubmit = async (data) => {
  setError("");
  const payload = { ...data }; 

  try {
    await axios.put(`/students/${id}`, payload);
    onClose();
  } catch (err) {
    console.log("Backend error:", err.response?.data);
    const errorData = err.response?.data?.errors;
    if (errorData && typeof errorData === "object") {
      Object.entries(errorData).forEach(([field, messages]) => {
        setFieldError(field, {
          type: "manual",
          message: Array.isArray(messages) ? messages.join(" ") : messages,
        });
      });
    } else {
      setError(err.response?.data?.message || "Update failed.");
    }
  }
};


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
        Edit Student Details
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box textAlign="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Student Info Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PersonIcon color="primary" /> Student Info
              </Typography>
              <Stack spacing={2}>
                <TextField label="Username" fullWidth {...register("username", { required: "Required" })} error={!!errors.username} helperText={errors.username?.message} />
                <TextField label="Email" fullWidth {...register("email", { required: "Required" })} error={!!errors.email} helperText={errors.email?.message} />
                <TextField label="First Name" fullWidth {...register("first_name", { required: "Required" })} error={!!errors.first_name} helperText={errors.first_name?.message} />
                <TextField label="Last Name" fullWidth {...register("last_name")} error={!!errors.last_name} helperText={errors.last_name?.message} />
              </Stack>
            </Paper>

            {/* Contact Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <ContactPhoneIcon color="success" /> Contact Info
              </Typography>
              <Stack spacing={2}>
                <TextField label="Phone" fullWidth {...register("phone", { required: "Required" })} error={!!errors.phone} helperText={errors.phone?.message} />
                <TextField label="Roll Number" fullWidth {...register("roll_number", { required: "Required" })} error={!!errors.roll_number} helperText={errors.roll_number?.message} />
              </Stack>
            </Paper>

            {/* Dates & Status Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <EventIcon color="warning" /> Dates & Status
              </Typography>
              <Stack spacing={2}>
        <TextField
  label="Class"
  select
  fullWidth
  value={watch("student_class") || ""} 
  {...register("student_class", { required: "Required" })}
  error={!!errors.student_class}
  helperText={errors.student_class?.message}
>
  {Array.from({ length: 12 }, (_, i) => (
    <MenuItem key={i + 1} value={`${i + 1}`}>{`Class ${i + 1}`}</MenuItem>
  ))}
</TextField>
                <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} fullWidth {...register("date_of_birth", { required: "Required" })} error={!!errors.date_of_birth} helperText={errors.date_of_birth?.message} />
                <TextField label="Admission Date" type="date" InputLabelProps={{ shrink: true }} fullWidth {...register("admission_date", { required: "Required" })} error={!!errors.admission_date} helperText={errors.admission_date?.message} />
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={watch("status") || ""}
                  {...register("status", { required: true })}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>

              </Stack>
            </Paper>

            {/* Actions */}
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={onClose} color="inherit">Cancel</Button>
              <Button type="submit" variant="contained">Update</Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditStudentForm;
