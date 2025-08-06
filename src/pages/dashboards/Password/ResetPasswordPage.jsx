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
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const ResetPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post("/api/password-reset/confirm", {
        uid,
        token,
        new_password: data.new_password,
      });

      setMessage("Password has been reset successfully. You can now log in.");
    } catch (err) {
      setError("Reset link is invalid or expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login")
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 10, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Reset Password
        </Typography>

        {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            {...register("new_password", { required: "New password is required" })}
            error={!!errors.new_password}
            helperText={errors.new_password?.message}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            margin="normal"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: value =>
                value === watch("new_password") || "Passwords do not match",
            })}
            error={!!errors.confirm_password}
            helperText={errors.confirm_password?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" /> 
            ) : (

             "Reset Password"
            )}
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

export default ResetPasswordPage;
