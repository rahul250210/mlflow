"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      setError("");
      await axiosInstance.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed: Email may already exist.");
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
          Create Account ✨
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={3}
        >
          Join us and explore amazing features.
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            onChange={handleChange}
            fullWidth
            autoFocus
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <TextField
            label="Email Address"
            name="email"
            variant="outlined"
            onChange={handleChange}
            fullWidth
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
            onClick={handleSignup}
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
            Sign Up
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2">
          Already have an account?{" "}
          <Typography
            component="span"
            color="primary"
            sx={{
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Login
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
}
