import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Grid,
  Dialog,
  TextField,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import ModelCard from "../components/ModelCard";

export default function ModelsPage() {
  const { algorithmId } = useParams();
  const navigate = useNavigate();

  const [models, setModels] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
  const fetchModels = async () => {
    const res = await axiosInstance.get(`/models/algorithm/${algorithmId}`);
    setModels(res.data);
  };

  fetchModels();
}, [algorithmId]);


  const fetchModels = async () => {
    const res = await axiosInstance.get(`/models/algorithm/${algorithmId}`);
    setModels(res.data);
  };

  const createModel = async () => {
    await axiosInstance.post(`/models/${algorithmId}`, {
      name,
      description,
    });
    setOpen(false);
    setName("");
    setDescription("");
    fetchModels();
  };

  return (
    <>
      <Button variant="text" onClick={() => navigate(-1)}>
        ← Back to Algorithms
      </Button>

      <Typography variant="h4" gutterBottom>
        Models
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Create New Model
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {models.map((model) => (
          <Grid item key={model.id} xs={12} md={4}>
            <ModelCard model={model} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 20, width: 400 }}>
          <Typography variant="h6">Create Model</Typography>

          <TextField
            fullWidth
            label="Model Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button fullWidth variant="contained" onClick={createModel}>
            Create
          </Button>
        </div>
      </Dialog>
    </>
  );
}
