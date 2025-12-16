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
  CircularProgress
} from "@mui/material";

import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";

import FactoryIcon from "@mui/icons-material/Factory";
import HubIcon from "@mui/icons-material/Hub";
import SchemaIcon from "@mui/icons-material/Schema";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    factories: 0,
    algorithms: 0,
    models: 0,
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchDashboardData = async () => {
  try {
    // 1️⃣ Fetch dashboard stats (factories, algorithms, models)
    const statsRes = await axiosInstance.get("/dashboard/stats");

    setStats(statsRes.data);

    // 2️⃣ Fetch recent uploads
    const uploadsRes = await axiosInstance.get("/models/recent-files");

    setRecentUploads(uploadsRes.data.slice(0, 5));

  } catch (err) {
    console.error("Dashboard fetch error:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDashboardData();
  const interval = setInterval(() => {
    fetchDashboardData(); // refresh every 5 seconds
  }, 5000);

  return () => clearInterval(interval); // cleanup
}, []);

  const analyticsData = [
    { name: "Mon", uploads: 4 },
    { name: "Tue", uploads: 9 },
    { name: "Wed", uploads: 6 },
    { name: "Thu", uploads: 10 },
    { name: "Fri", uploads: 7 },
    { name: "Sat", uploads: 3 },
    { name: "Sun", uploads: 8 },
  ];

  const modelTrendData = [
    { name: "Jan", models: 2 },
    { name: "Feb", models: 5 },
    { name: "Mar", models: 3 },
    { name: "Apr", models: 8 },
    { name: "May", models: 6 },
  ];

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3}>
        {[
          {
            label: "Total Factories",
            value: stats.factories,
            icon: <FactoryIcon sx={{ color: "#3b82f6", fontSize: 30 }} />,
          },
          {
            label: "Total Algorithms",
            value: stats.algorithms,
            icon: <HubIcon sx={{ color: "#f97316", fontSize: 30 }} />,
          },
          {
            label: "Total Models",
            value: stats.models,
            icon: <SchemaIcon sx={{ color: "#8b5cf6", fontSize: 30 }} />,
          },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={i}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  background: "white",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    {card.icon}
                    <Box>
                      <Typography variant="h5" fontWeight="700">
                        {card.value}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7 }}>
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

      {/* GRAPHS */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: "16px",
              background: "white",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
              Weekly Upload Analytics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="uploads" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              p: 2,
              borderRadius: "16px",
              background: "white",
              boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
              Model Growth Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={modelTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="models"
                  stroke="#10b981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* RECENT UPLOADS */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            borderRadius: "16px",
            p: 2,
            background: "white",
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
          }}
        >
          <Typography variant="h6" fontWeight="700">
            Recent Uploads
          </Typography>

          <Divider sx={{ my: 2 }} />

          <List>
            {recentUploads.length === 0 && (
              <Typography sx={{ opacity: 0.6 }}>No uploads yet.</Typography>
            )}

              {recentUploads.map((file) => (
          <ListItem
            key={file.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "10px",
              transition: "0.2s",
              ":hover": {
                backgroundColor: "rgba(99,102,241,0.06)",
              },
            }}
          >
            {/* LEFT: File Info */}
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#6366f1",
                  mr: 2,
                  width: 42,
                  height: 42,
                }}
              >
                <UploadFileIcon />
              </Avatar>

              <ListItemText
                primary={
                  <Typography fontWeight={600} fontSize="0.95rem">
                    {file.file_name}
                  </Typography>
                }
                secondary={
                  "Uploaded on " +
                  new Date(file.created_at).toLocaleDateString()
                }
              />
            </Box>

            {/* RIGHT: Download Button */}
            <IconButton
              component="a"
              href={`http://127.0.0.1:8000/models/download/${file.id}`}
              download
              sx={{
                background: "rgba(34,197,94,0.12)",
                borderRadius: "10px",
                ":hover": {
                  background: "rgba(34,197,94,0.25)",
                },
              }}
            >
              <DownloadIcon sx={{ color: "#22c55e" }} />
            </IconButton>
          </ListItem>
        ))}

          </List>
        </Card>
      </Box>
    </Box>
  );
}
