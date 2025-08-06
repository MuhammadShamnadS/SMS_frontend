// src/pages/dashboards/Teachers/EditTeacherForm.jsx
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
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

const EditTeacherForm = () => {
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

  // Fetch teacher details
  useEffect(() => {
    axios
      .get(`/teachers/${id}`)
      .then((res) => {
        const t = res.data;
        reset({
          username: t.user.username,
          email: t.user.email,
          first_name: t.user.first_name,
          last_name: t.user.last_name,
          phone: t.phone,
          subject_specialization: t.subject_specialization,
          employee_id: t.employee_id,
          date_of_joining: t.date_of_joining,
          status: t.status,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load teacher data.");
        setLoading(false);
      });
  }, [id, reset]);

  const onClose = () => {
    setOpen(false);
    navigate("/dashboard/teachers");
  };

  //Sends payload
  const onSubmit = async (data) => {
    setError("");
  const payload = { ...data }; 
    try {
        await axios.put(`/teachers/${id}`, payload);
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
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box textAlign="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField fullWidth label="Username" margin="normal" {...register("username", { required: "Username is required" })} error={!!errors.username} helperText={errors.username?.message} />
            <TextField fullWidth label="Email" margin="normal" {...register("email", { required: "Email is required" })} error={!!errors.email} helperText={errors.email?.message} />
            <TextField fullWidth label="First Name" margin="normal" {...register("first_name", { required: "First name is required" })} error={!!errors.first_name} helperText={errors.first_name?.message} />
            <TextField fullWidth label="Last Name" margin="normal" {...register("last_name")} error={!!errors.last_name} helperText={errors.last_name?.message} />
            <TextField fullWidth label="Phone" margin="normal" {...register("phone", { required: "Phone is required" })} error={!!errors.phone} helperText={errors.phone?.message} />
            <TextField fullWidth label="Subject Specialization" margin="normal" {...register("subject_specialization", { required: "Subject is required" })} error={!!errors.subject_specialization} helperText={errors.subject_specialization?.message} />
            <TextField fullWidth label="Employee ID" margin="normal" {...register("employee_id", { required: "Employee ID is required" })} error={!!errors.employee_id} helperText={errors.employee_id?.message} />
            <TextField fullWidth label="Date of Joining" type="date" margin="normal" InputLabelProps={{ shrink: true }} {...register("date_of_joining", { required: "Date of joining is required" })} error={!!errors.date_of_joining} helperText={errors.date_of_joining?.message} />

                <TextField fullWidth
                  label="Status"
                  select
                  value={watch("status") || ""}
                  {...register("status", { required: true })}
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>

            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">Update</Button>
            </DialogActions>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTeacherForm;
