import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

export default function ModelDetailPage() {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [fileType, setFileType] = useState("dataset");
  const [file, setFile] = useState(null);

  useEffect(() => {
  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/models/files/${modelId}`);
    setFiles(res.data);
  };

  fetchFiles();
}, [modelId]);


  const fetchFiles = async () => {
    const res = await axiosInstance.get(`/models/files/${modelId}`);
    setFiles(res.data);
  };

  const uploadFile = async () => {
    if (!file) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post(
      `/models/upload/${modelId}?file_type=${fileType}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setFile(null);
    fetchFiles();
  };

  const deleteFile = async (fileId) => {
    await axiosInstance.delete(`/models/file/${fileId}`);
    fetchFiles();
  };

  return (
    <>
      <Button onClick={() => navigate(-1)}>← Back</Button>

      <Typography variant="h4" gutterBottom>
        Model Files & Uploads
      </Typography>

      {/* Upload Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload New File
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center">
            <Select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <MenuItem value="dataset">Dataset ZIP</MenuItem>
              <MenuItem value="model_file">Model File</MenuItem>
              <MenuItem value="metrics">Metrics / Graph</MenuItem>
              <MenuItem value="python_code">Python Code</MenuItem>
            </Select>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Button variant="contained" onClick={uploadFile}>
              Upload
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Uploaded Files Section */}
      <Grid container spacing={2}>
        {files.map((f) => (
          <Grid item xs={12} md={6} key={f.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{f.file_name}</Typography>

                <Typography variant="body2">
                  Type: {f.file_type}
                </Typography>

                <Typography variant="body2">
                  Size: {(f.file_size / 1024).toFixed(2)} KB
                </Typography>

                <Typography variant="caption" display="block">
                  Uploaded:{" "}
                  {new Date(f.created_at).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    href={`http://127.0.0.1:8000/${f.file_path}`}
                    target="_blank"
                  >
                    Download
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteFile(f.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
