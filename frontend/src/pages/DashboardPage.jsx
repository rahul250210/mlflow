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

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="70vh"
        flexDirection="column"
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
    /* 🔥 CENTERED WRAPPER */
    <Box
      sx={{
        px: 4,
        pb: 4,
        width: "100%",
        maxWidth: "100%",
      }}
    >

      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Dashboard Overview
        </Typography>
        <Typography color="text.secondary">
          System-wide insights across factories, algorithms, and models
        </Typography>
      </Box>

      {/* KPI CARDS — EVENLY DISTRIBUTED */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        mb={5}
      >
        {[
          {
            label: "Factories",
            value: stats.factories,
            icon: <FactoryIcon sx={{ color: "#2563eb", fontSize: 38 }} />,
          },
          {
            label: "Algorithms",
            value: stats.algorithms,
            icon: <HubIcon sx={{ color: "#ea580c", fontSize: 38 }} />,
          },
          {
            label: "Models",
            value: stats.models,
            icon: <SchemaIcon sx={{ color: "#7c3aed", fontSize: 38 }} />,
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <motion.div whileHover={{ scale: 1.04 }}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  {card.icon}
                  <Box>
                    <Typography variant="h4" fontWeight={800}>
                      {card.value}
                    </Typography>
                    <Typography color="text.secondary">
                      Total {card.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

     
      {/* CHARTS — BEAUTIFIED & BALANCED */}
<Grid
  container
  spacing={4}
  justifyContent="center"
  alignItems="stretch"
  mb={5}
>
  {/* BAR CHART */}
 <Grid item xs={12} lg={6}>
  <Card
    sx={{
      width: "100%",
      height: 520,
      borderRadius: 4,
      p: 3,
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    }}
  >
    <Typography variant="h6" fontWeight={700} mb={2}>
      Models per Factory
    </Typography>

    <Box sx={{ width: "100%", height: "430px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={modelsPerFactory}
          margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-15}
            textAnchor="end"
            interval={0}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#6366f1"
            radius={[10, 10, 0, 0]}
            barSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Card>
</Grid>


  {/* PIE CHART */}
 <Grid item xs={12} lg={6}>
  <Card
    sx={{
      width: "100%",
      height: 520,
      borderRadius: 4,
      p: 8,
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    }}
  >
    <Typography variant="h6" fontWeight={700} mb={2}>
      Models per Algorithm
    </Typography>

    <Box sx={{ width: "100%", height: "430px" }}>
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Tooltip />

      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{ right: -10 }}
      />

      <Pie
        data={modelsPerAlgorithm}
        dataKey="count"
        nameKey="name"

        /* ✅ FIXED POSITIONING */
        cx="85%"
        cy="40%"

        /* ✅ SAFE RADII */
        innerRadius={70}
        outerRadius={110}

        paddingAngle={4}
        isAnimationActive
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
</Box>

  </Card>
</Grid>

</Grid>


      {/* RECENT UPLOADS */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
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
                    secondary={`Uploaded on ${new Date(
                      file.created_at
                    ).toLocaleDateString()}`}
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
