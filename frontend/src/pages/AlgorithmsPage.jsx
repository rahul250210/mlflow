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
import AlgorithmCard from "../components/AlgorithmCard";

export default function AlgorithmsPage() {
  const { factoryId } = useParams();
  const navigate = useNavigate();

  const [algorithms, setAlgorithms] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
  const fetchAlgorithms = async () => {
    const res = await axiosInstance.get(`/algorithms/factory/${factoryId}`);
    setAlgorithms(res.data);
  };

  fetchAlgorithms();
}, [factoryId]);


  const fetchAlgorithms = async () => {
    const res = await axiosInstance.get(`/algorithms/factory/${factoryId}`);
    setAlgorithms(res.data);
  };

  const createAlgorithm = async () => {
    await axiosInstance.post(`/algorithms/${factoryId}`, {
      name,
      description,
    });
    setOpen(false);
    setName("");
    setDescription("");
    fetchAlgorithms();
  };

  return (
    <>
      <Button variant="text" onClick={() => navigate("/")}>
        ← Back to Factories
      </Button>

      <Typography variant="h4" gutterBottom>
        Algorithms
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Create New Algorithm
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {algorithms.map((algo) => (
          <Grid item key={algo.id} xs={12} md={4}>
            <AlgorithmCard algorithm={algo} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 20, width: 400 }}>
          <Typography variant="h6">Create Algorithm</Typography>

          <TextField
            fullWidth
            label="Algorithm Name"
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

          <Button fullWidth variant="contained" onClick={createAlgorithm}>
            Create
          </Button>
        </div>
      </Dialog>
    </>
  );
}
