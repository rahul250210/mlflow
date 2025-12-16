"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AllModelsPage() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await axiosInstance.get("/models/all");
        setModels(res.data);
      } catch (err) {
        console.error("Failed to load models", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  /* ---------- Loading State ---------- */
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
        gap={2}
      >
        <CircularProgress size={42} />
        <Typography color="text.secondary">
          Loading models registry...
        </Typography>
      </Box>
    );
  }

  /* ---------- Empty State ---------- */
  if (!models.length) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6" color="text.secondary">
          No models found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Models created inside factories will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* ---------- Page Header ---------- */}
      <Stack spacing={0.5} mb={3}>
        <Typography variant="h4" fontWeight={800}>
          Models Registry
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Centralized view of all models across factories and algorithms
        </Typography>
      </Stack>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 700 }}>Model</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Factory</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Algorithm</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {models.map((row, index) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => navigate(`/model/${row.id}`)}
                  sx={{
                    transition: "background 0.2s ease",
                    "&:hover": { backgroundColor: "#f9fafb" },
                  }}
                >
                  {/* Model Name */}
                  <TableCell>
                    <Stack spacing={0.3}>
                      <Typography fontWeight={600}>
                        {row.model_name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Model ID: {row.id}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* Factory */}
                  <TableCell>
                    <Chip
                      label={row.factory_name}
                      size="small"
                      sx={{
                        backgroundColor: "#eff6ff",
                        color: "#1d4ed8",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  {/* Algorithm */}
                  <TableCell>
                    <Chip
                      label={row.algorithm_name}
                      size="small"
                      sx={{
                        backgroundColor: "#fdf4ff",
                        color: "#7e22ce",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(row.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider />

          {/* ---------- Footer ---------- */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2.5}
            py={1.5}
            sx={{ backgroundColor: "#f8fafc" }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {models.length} model{models.length > 1 ? "s" : ""}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              PICASSO Nexus · Models Registry
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
