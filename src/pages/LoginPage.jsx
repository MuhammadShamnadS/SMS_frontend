import React, { useState, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      await login(data.username, data.password);
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={{ height: "100vh", width: "100vw", m: 0 }}>

      <Grid
        item
        xs={12}
        md={6}
        sx={{
          background: "linear-gradient(to right, #1976d2, #42a5f5)",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          px: { xs: 3, sm: 5, md: 8 },
          py: 4,
          textAlign: "center",
        }}
      >
        <Box sx={{ maxWidth: 400, mx: 8}}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          School Management
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 400, textAlign: "center" }}>
          Empower your institution with a smart, secure, and modern school management system.
        </Typography>
        </Box>
      </Grid>


      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, sm: 5, md: 8 },
          py: 4,
          bgcolor: "#fff",
        }}
      >
        <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              autoComplete="username"
              {...register("username", { required: "Username is required" })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 2, cursor: "pointer", color: "primary.main" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Typography>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
