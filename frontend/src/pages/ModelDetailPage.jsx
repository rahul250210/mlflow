"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  Snackbar,
  Alert,
  IconButton,
  Chip,
  Divider,
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
  const [imageMap, setImageMap] = useState({}); // 🔥 metric images

  const FILE_RULES = {
  dataset: [".zip"],
  model_file: [".pt", ".pth", ".onnx", ".h5", ".pkl"],
  metrics: [".png", ".jpg", ".jpeg", ".csv", ".json"],
  python_code: [".py"],
  };


  /* -------------------- FETCH FILES -------------------- */
  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/models/files/${modelId}`);
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, [modelId]);

  /* -------------------- LOAD METRIC IMAGES (BLOB) -------------------- */
  useEffect(() => {
    files.forEach((f) => {
      if (f.file_type === "metrics" && !imageMap[f.id]) {
        axiosInstance
          .get(`/models/download/${f.id}`, { responseType: "blob" })
          .then((res) => {
            const url = URL.createObjectURL(res.data);
            setImageMap((prev) => ({ ...prev, [f.id]: url }));
          });
      }
    });
  }, [files]);

  /* -------------------- FILE UPLOAD (UNCHANGED UI) -------------------- */
  const uploadFile = async () => {
    if (!file) {
      setSnack({ open: true, msg: "Please select a file", type: "error" });
      return;
    }
    // Check duplicate in already fetched files
  const duplicate = files.find(
    (f) =>
      f.file_name === file.name &&
      f.file_type === fileType
  );

  if (duplicate) {
    setSnack({
      open: true,
      msg: "This file already exists in model artifacts",
      type: "warning",
    });
    return;
  }
    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post(
      `/models/upload/${modelId}?file_type=${fileType}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setSnack({ open: true, msg: " uploaded successfully", type: "success" });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    fetchFiles();
  };

  const deleteFile = async (id) => {
    await axiosInstance.delete(`/models/file/${id}`);
    setSnack({ open: true, msg: "File deleted", type: "success" });
    fetchFiles();
  };

  const downloadFile = async (id, name) => {
    const res = await axiosInstance.get(`/models/download/${id}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const validateFile = (file, fileType) => {
  const allowedExts = FILE_RULES[fileType];
  if (!allowedExts) return false;

  const fileName = file.name.toLowerCase();
  return allowedExts.some((ext) => fileName.endsWith(ext));
  };

  const iconFor = (type) => {
    if (type === "dataset") return <FolderZipIcon color="primary" />;
    if (type === "model_file") return <InsertDriveFileIcon color="success" />;
    if (type === "metrics") return <AnalyticsIcon color="warning" />;
    return <CodeIcon color="secondary" />;
  };

  const grouped = {
  metrics: files.filter((f) => f.file_type === "metrics"),
  model_file: files.filter((f) => f.file_type === "model_file"),
  dataset: files.filter((f) => f.file_type === "dataset"),
  python_code: files.filter((f) => f.file_type === "python_code"),
  };

  /* -------------------- UI -------------------- */
  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3, textTransform: "none", fontWeight: 600 }}
      >
        Back
      </Button>

      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={800}>
          Model Files & Artifacts
        </Typography>
        <Typography sx={{ opacity: 0.6 }}>
          Datasets, metrics, model binaries and code
        </Typography>
      </Box>

      {/* UPLOAD SECTION — 🔒 UNCHANGED */}
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
  Artifacts
</Typography>

{/* METRICS */}
<Accordion defaultExpanded>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <AnalyticsIcon sx={{ mr: 1 }} />
    <Typography fontWeight={600}>
      Metrics ({grouped.metrics.length})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {grouped.metrics.length === 0 ? (
      <Typography sx={{ opacity: 0.6 }}>No metrics uploaded</Typography>
    ) : (
      grouped.metrics.map((f) => (
        <Card key={f.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography fontWeight={600}>{f.file_name}</Typography>

            <Box
              component="img"
              src={imageMap[f.id]}
              sx={{
                width: "100%",
                maxHeight: 520,
                objectFit: "contain",
                borderRadius: 2,
                mt: 2,
              }}
            />

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" justifyContent="space-between">
              <Chip label="METRICS" />
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => downloadFile(f.id, f.file_name)}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => deleteFile(f.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))
    )}
  </AccordionDetails>
</Accordion>

{/* MODEL FILES */}
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <InsertDriveFileIcon sx={{ mr: 1 }} />
    <Typography fontWeight={600}>
      Model Files ({grouped.model_file.length})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {grouped.model_file.map((f) => (
      <Stack
        key={f.id}
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        {iconFor("model_file")}
        <Typography sx={{ flexGrow: 1 }}>{f.file_name}</Typography>
        <IconButton onClick={() => downloadFile(f.id, f.file_name)}>
          <DownloadIcon />
        </IconButton>
        <IconButton color="error" onClick={() => deleteFile(f.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ))}
  </AccordionDetails>
</Accordion>

{/* DATASETS */}
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <FolderZipIcon sx={{ mr: 1 }} />
    <Typography fontWeight={600}>
      Datasets ({grouped.dataset.length})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {grouped.dataset.map((f) => (
      <Stack
        key={f.id}
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        {iconFor("dataset")}
        <Typography sx={{ flexGrow: 1 }}>{f.file_name}</Typography>
        <IconButton onClick={() => downloadFile(f.id, f.file_name)}>
          <DownloadIcon />
        </IconButton>
        <IconButton color="error" onClick={() => deleteFile(f.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ))}
  </AccordionDetails>
</Accordion>

{/* PYTHON CODE */}
<Accordion>
  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    <CodeIcon sx={{ mr: 1 }} />
    <Typography fontWeight={600}>
      Python Code ({grouped.python_code.length})
    </Typography>
  </AccordionSummary>
  <AccordionDetails>
    {grouped.python_code.map((f) => (
      <Stack
        key={f.id}
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        {iconFor("python_code")}
        <Typography sx={{ flexGrow: 1 }}>{f.file_name}</Typography>
        <IconButton onClick={() => downloadFile(f.id, f.file_name)}>
          <DownloadIcon />
        </IconButton>
        <IconButton color="error" onClick={() => deleteFile(f.id)}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    ))}
  </AccordionDetails>
</Accordion>
      <Snackbar open={snack.open} autoHideDuration={2500} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.type}>{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
}
