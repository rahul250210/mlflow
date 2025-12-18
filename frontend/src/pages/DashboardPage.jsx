"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

import FactoryIcon from "@mui/icons-material/Factory";
import HubIcon from "@mui/icons-material/Hub";
import SchemaIcon from "@mui/icons-material/Schema";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#8b5cf6",
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    factories: 0,
    algorithms: 0,
    models: 0,
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [modelsPerFactory, setModelsPerFactory] = useState([]);
  const [modelsPerAlgorithm, setModelsPerAlgorithm] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await axiosInstance.get("/dashboard/stats");
      const factoryRes = await axiosInstance.get("/dashboard/models-per-factory");
      const algoRes = await axiosInstance.get("/dashboard/models-per-algorithm");
      const uploadsRes = await axiosInstance.get("/models/recent-files");

      setStats(statsRes.data);
      setModelsPerFactory(factoryRes.data || []);
      setModelsPerAlgorithm(algoRes.data || []);
      setRecentUploads(uploadsRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="70vh"
        gap={2}
      >
        <CircularProgress size={44} />
        <Typography color="text.secondary">
          Loading dashboard insights...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 3, pb: 4, maxWidth: "1600px", mx: "auto" }}>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          System-wide insights across factories, algorithms, and models
        </Typography>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} mb={4}>
        {[
          {
            label: "Factories",
            value: stats.factories,
            icon: <FactoryIcon sx={{ color: "#2563eb", fontSize: 34 }} />,
          },
          {
            label: "Algorithms",
            value: stats.algorithms,
            icon: <HubIcon sx={{ color: "#ea580c", fontSize: 34 }} />,
          },
          {
            label: "Models",
            value: stats.models,
            icon: <SchemaIcon sx={{ color: "#7c3aed", fontSize: 34 }} />,
          },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {card.icon}
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total {card.label}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={3} mb={4}>
        {/* MODELS PER FACTORY */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
    p: 4,
    minHeight: 520,
    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",

            }}
          >
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Models per Factory
              </Typography>

              <Box sx={{ width: "100%", height: 360 }}>
                {modelsPerFactory.length === 0 ? (
                  <Typography color="text.secondary">
                    No models available yet.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelsPerFactory} margin={{ left: 10, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#6366f1"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* MODELS PER ALGORITHM */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
    p: 4,
    minHeight: 520,
    boxShadow: "0 12px 32px rgba(0,0,0,0.08)",

            }}
          >
            <CardContent sx={{ pb: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Models per Algorithm
              </Typography>

              <Box sx={{ width: "100%", height: 360 }}>
                {modelsPerAlgorithm.length === 0 ? (
                  <Typography color="text.secondary">
                    No algorithms available yet.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={48} />
                      <Pie
                        data={modelsPerAlgorithm}
                        dataKey="count"
                        nameKey="name"
                        outerRadius={130}
                        paddingAngle={3}
                      >
                        {modelsPerAlgorithm.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* RECENT UPLOADS */}
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700}>
            Recent Uploads
          </Typography>

          <Divider sx={{ my: 2 }} />

          {recentUploads.length === 0 ? (
            <Typography color="text.secondary">
              No uploads yet.
            </Typography>
          ) : (
            <List>
              {recentUploads.map((file) => (
                <ListItem
                  key={file.id}
                  secondaryAction={
                    <IconButton
                      href={`http://127.0.0.1:8000/models/download/${file.id}`}
                    >
                      <DownloadIcon sx={{ color: "#22c55e" }} />
                    </IconButton>
                  }
                >
                  <Avatar sx={{ bgcolor: "#6366f1", mr: 2 }}>
                    <UploadFileIcon />
                  </Avatar>

                  <ListItemText
                    primary={file.file_name}
                    secondary={
                      "Uploaded on " +
                      new Date(file.created_at).toLocaleDateString()
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
