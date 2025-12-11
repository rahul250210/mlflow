"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Typography, Button, Grid, Card, CardContent, MenuItem, Select, Stack, Container } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import axiosInstance from "../api/axiosInstance"

export default function ModelDetailPage() {
  const { modelId } = useParams()
  const navigate = useNavigate()

  const [files, setFiles] = useState([])
  const [fileType, setFileType] = useState("dataset")
  const [file, setFile] = useState(null)

  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/models/files/${modelId}`)
    setFiles(res.data)
  }

  useEffect(() => {
    fetchFiles()
  }, [modelId])

  const uploadFile = async () => {
    if (!file) return alert("Select a file")

    const formData = new FormData()
    formData.append("file", file)

    await axiosInstance.post(`/models/upload/${modelId}?file_type=${fileType}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    setFile(null)
    fetchFiles()
  }

  const deleteFile = async (fileId) => {
    await axiosInstance.delete(`/models/file/${fileId}`)
    fetchFiles()
  }

  return (
    <Container maxWidth="lg">
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "#3b82f6",
          fontWeight: 600,
        }}
      >
        Back
      </Button>

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          mb: 3,
        }}
      >
        Model Files & Uploads
      </Typography>

      {/* Upload Section */}
      <Card
        sx={{
          mb: 3,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.1)",
          borderRadius: "12px",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2.5 }}>
            Upload New File
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap", gap: 2 }}>
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              sx={{
                borderRadius: "8px",
                flex: 1,
                minWidth: "150px",
                backgroundColor: "background.paper",
              }}
            >
              <MenuItem value="dataset">Dataset ZIP</MenuItem>
              <MenuItem value="model_file">Model File</MenuItem>
              <MenuItem value="metrics">Metrics / Graph</MenuItem>
              <MenuItem value="python_code">Python Code</MenuItem>
            </Select>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                backgroundColor: "rgba(59, 130, 246, 0.02)",
              }}
            />

            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={uploadFile}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Upload
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, mt: 3 }}>
        Uploaded Files
      </Typography>

      <Grid container spacing={2}>
        {files.map((f) => (
          <Grid item xs={12} md={6} key={f.id}>
            <Card
              sx={{
                borderRadius: "12px",
                border: "1px solid rgba(226, 232, 240, 0.2)",
                transition: "all 0.2s ease",
                ":hover": {
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {f.file_name}
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Type: <span style={{ fontWeight: 600, color: "#3b82f6" }}>{f.file_type}</span>
                </Typography>

                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Size: {(f.file_size / 1024).toFixed(2)} KB
                </Typography>

                <Typography variant="caption" display="block" sx={{ color: "text.secondary", mb: 1.5, opacity: 0.7 }}>
                  Uploaded: {new Date(f.created_at).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<DownloadIcon />}
                    href={`http://127.0.0.1:8000/${f.file_path}`}
                    target="_blank"
                    sx={{
                      background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "6px",
                    }}
                  >
                    Download
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => deleteFile(f.id)}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "6px",
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
