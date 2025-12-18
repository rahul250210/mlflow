"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
  Container,
  Box,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CodeIcon from "@mui/icons-material/Code";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import axiosInstance from "../api/axiosInstance";
import { motion } from "framer-motion";

export default function ModelDetailPage() {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState("dataset");
  const [file, setFile] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/models/files/${modelId}`);
    setFiles(res.data);
  };

  const FILE_RULES = {
  dataset: [".zip"],
  model_file: [".pt", ".pth", ".onnx", ".h5", ".pkl"],
  metrics: [".png", ".jpg", ".jpeg", ".csv", ".json"],
  python_code: [".py"],
};

const validateFile = (file, fileType) => {
  const allowedExts = FILE_RULES[fileType];
  if (!allowedExts) return false;

  const fileName = file.name.toLowerCase();
  return allowedExts.some((ext) => fileName.endsWith(ext));
};

  useEffect(() => {
    fetchFiles();
  }, [modelId]);

  const uploadFile = async () => {
    if (!file) {
      setSnack({ open: true, msg: "Please select a file", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post(
      `/models/upload/${modelId}?file_type=${fileType}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setSnack({ open: true, msg: "File uploaded successfully", type: "success" });
    setFile(null);
    if (fileInputRef.current) {
    fileInputRef.current.value = "";   // 🔥 Reset actual file chooser
  }
    fetchFiles();
  };

  const deleteFile = async (fileId) => {
    await axiosInstance.delete(`/models/file/${fileId}`);
    setSnack({ open: true, msg: "File deleted successfully", type: "success" });
    fetchFiles();
  };

  const downloadFile = async (fileId, filename) => {
  try {
    const response = await axiosInstance.get(
      `/models/download/${fileId}`,
      {
        responseType: "blob",
      }
    );

    const blobUrl = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {
    setSnack({
      open: true,
      msg: "Download failed — Unauthorized",
      type: "error",
    });
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "dataset":
        return <FolderZipIcon sx={{ color: "#2563eb" }} />;
      case "model_file":
        return <InsertDriveFileIcon sx={{ color: "#10b981" }} />;
      case "metrics":
        return <AnalyticsIcon sx={{ color: "#f59e0b" }} />;
      case "python_code":
        return <CodeIcon sx={{ color: "#7c3aed" }} />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      {/* BACK BUTTON */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 3,
          textTransform: "none",
          color: "#6366f1",
          fontWeight: 600,
          ":hover": { backgroundColor: "rgba(99,102,241,0.08)" },
        }}
      >
        Back
      </Button>

      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeIcon sx={{ fontSize: 34, color: "#6366f1" }} />
          <Typography
            variant="h4"
            fontWeight="800"
            sx={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Model Files & Artifacts
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.7, color: "#475569", mt: 0.5 }}>
          Upload model files, datasets, graphs, and Python code.
        </Typography>
      </Box>

      {/* UPLOAD SECTION */}
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          mb: 4,
          borderRadius: "16px",
          padding: 2,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Upload New File
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* FILE TYPE SELECT */}
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              sx={{
                minWidth: 180,
                borderRadius: "12px",
                backgroundColor: "white",
              }}
            >
              <MenuItem value="dataset">Dataset ZIP</MenuItem>
              <MenuItem value="model_file">Model File</MenuItem>
              <MenuItem value="metrics">Metrics / Graph</MenuItem>
              <MenuItem value="python_code">Python Code</MenuItem>
            </Select>

            {/* FILE INPUT */}
            <input
              type="file"
              ref={fileInputRef}
             onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (!selectedFile) return;

                  if (!validateFile(selectedFile, fileType)) {
                    setSnack({
                      open: true,
                      msg: `Invalid file type. Allowed: ${FILE_RULES[fileType].join(", ")}`,
                      type: "error",
                    });

                    e.target.value = ""; // reset file chooser
                    setFile(null);
                    return;
                  }

                  setFile(selectedFile);
                }}

              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                border: "1px solid rgba(59,130,246,0.25)",
                backgroundColor: "rgba(59,130,246,0.03)",
              }}
            />

            {/* UPLOAD BUTTON */}
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={uploadFile}
              sx={{
                px: 3,
                borderRadius: "12px",
                textTransform: "none",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
              }}
            >
              Upload
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* FILES LIST */}
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Uploaded Files
      </Typography>

      <Grid container spacing={3}>
        {files.map((f) => (
          <Grid item xs={12} md={6} key={f.id}>
            <Card
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              sx={{
                borderRadius: "16px",
                border: "1px solid rgba(226,232,240,0.4)",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                transition: "0.2s",
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  {/* Icon */}
                  {getFileIcon(f.file_type)}

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {f.file_name}
                    </Typography>

                    <Chip
                      label={f.file_type.toUpperCase()}
                      size="small"
                      sx={{ mt: 0.5, backgroundColor: "#eef2ff", color: "#4f46e5" }}
                    />

                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                      Size: {(f.file_size / 1024).toFixed(2)} KB
                    </Typography>

                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      Uploaded: {new Date(f.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Stack direction="column" spacing={1}>
                    {/* DOWNLOAD */}
                 <IconButton
                        onClick={() => downloadFile(f.id, f.file_name)}
                        sx={{
                          background: "rgba(34,197,94,0.12)",
                          borderRadius: "10px",
                          transition: "0.2s",
                          ":hover": { background: "rgba(34,197,94,0.25)" },
                        }}
                      >
                        <DownloadIcon sx={{ color: "#22c55e" }} />
                      </IconButton>


                    {/* DELETE */}
                    <IconButton
                      onClick={() => deleteFile(f.id)}
                      sx={{
                        background: "rgba(239,68,68,0.1)",
                        ":hover": { background: "rgba(239,68,68,0.2)" },
                      }}
                    >
                      <DeleteIcon sx={{ color: "#ef4444" }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* EMPTY STATE */}
      {files.length === 0 && (
        <Box
          sx={{ textAlign: "center", mt: 10, opacity: 0.7 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <InsertDriveFileIcon sx={{ fontSize: 70, opacity: 0.3 }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            No files uploaded yet
          </Typography>
          <Typography variant="body2">Upload your first file above</Typography>
        </Box>
      )}

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={2600}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.type} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
