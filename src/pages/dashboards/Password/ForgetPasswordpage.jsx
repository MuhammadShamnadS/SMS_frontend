import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login")
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post("/api/password-reset", { email: data.email });
      setMessage("If the email exists, a reset link has been sent.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Forgot Password
        </Typography>

        {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>
        </Box>
        <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
