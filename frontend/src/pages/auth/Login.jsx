"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      setError("");
      const res = await axiosInstance.post("/auth/login", form);

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (e) {
      if (e.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Server error: Try again later.");
      }
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(145deg, #eef2f3, #dfe9f3)",
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
          textAlign: "center",
          bgcolor: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          mb={1}
          sx={{ letterSpacing: 0.6 }}
        >
          Welcome Back 👋
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
          sx={{ lineHeight: 1.6 }}
        >
          Login to your account to continue
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Email Address"
            name="email"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            autoFocus
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                fontSize: "0.85rem",
                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              py: 1.2,
              mt: 1,
              fontSize: "1rem",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              transition: "0.2s",
              ":hover": { opacity: 0.9 },
            }}
          >
            Sign In
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="text.secondary">
          Don't have an account?{" "}
          <Typography
            component="span"
            color="primary"
            sx={{
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/signup")}
          >
            Create one
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
