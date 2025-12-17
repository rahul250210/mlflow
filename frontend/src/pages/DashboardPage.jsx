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
} from "@mui/material";

import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

import FactoryIcon from "@mui/icons-material/Factory";
import HubIcon from "@mui/icons-material/Hub";
import SchemaIcon from "@mui/icons-material/Schema";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";

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
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Total Factories",
            value: stats.factories,
            icon: <FactoryIcon sx={{ color: "#3b82f6", fontSize: 32 }} />,
          },
          {
            label: "Total Algorithms",
            value: stats.algorithms,
            icon: <HubIcon sx={{ color: "#f97316", fontSize: 32 }} />,
          },
          {
            label: "Total Models",
            value: stats.models,
            icon: <SchemaIcon sx={{ color: "#8b5cf6", fontSize: 32 }} />,
          },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {card.icon}
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.label}
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
      <Grid container spacing={3}>
        {/* MODELS PER FACTORY */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Models per Factory
            </Typography>

            {modelsPerFactory.length === 0 ? (
              <Typography color="text.secondary">
                No models available yet.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={modelsPerFactory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Grid>

        {/* MODELS PER ALGORITHM */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Models per Algorithm
            </Typography>

            {modelsPerAlgorithm.length === 0 ? (
              <Typography color="text.secondary">
                No algorithms available yet.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                  <Pie
                    data={modelsPerAlgorithm}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={110}
                    label
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
          </Card>
        </Grid>
      </Grid>

      {/* RECENT UPLOADS */}
      <Box mt={5}>
        <Card sx={{ borderRadius: 3, p: 2, boxShadow: 3 }}>
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
        </Card>
      </Box>
    </Box>
  );
}
