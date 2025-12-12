"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Typography, Grid, Dialog, TextField, Box, Container, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import axiosInstance from "../api/axiosInstance"
import ModelCard from "../components/ModelCard"
import SearchIcon from "@mui/icons-material/Search";
import SchemaIcon from "@mui/icons-material/Schema";
import { motion } from "framer-motion";

export default function ModelsPage() {
  const { algorithmId } = useParams()
  const navigate = useNavigate()

  const [models, setModels] = useState([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });
  const [search, setSearch] = useState("");

  useEffect(() => {
   const fetchModels = async () => {
    try {
      setLoading(true);
      const url = algorithmId ? `/models/algorithm/${algorithmId}` : `/models`;
      const res = await axiosInstance.get(url);
      setModels(res.data);
    } catch {
      setSnack({ open: true, msg: "Failed to load models", type: "error" });
    } finally {
      setLoading(false);
    }
  };

    fetchModels()
  }, [algorithmId])

  const fetchModels = async () => {
    const res = await axiosInstance.get(`/models/algorithm/${algorithmId}`)
    setModels(res.data)
  }

  const deleteModel = async (id) => {
  try {
    setLoading(true);
    await axiosInstance.delete(`/models/${id}`);

    setModels((prev) => prev.filter((m) => m.id !== id));

    setSnack({ open: true, msg: "Model deleted successfully", type: "success" });
  } catch (err) {
    setSnack({ open: true, msg: "Failed to delete model", type: "error" });
  } finally {
    setLoading(false);
  }
};

  const createModel = async () => {
    await axiosInstance.post(`/models/${algorithmId}`, {
      name,
      description,
    })
    setOpen(false)
    setName("")
    setDescription("")
    fetchModels()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>
      {/* BACK BUTTON */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "#6366f1",
          fontWeight: 600,
          ":hover": { backgroundColor: "rgba(99,102,241,0.08)" },
        }}
      >
        Back to Algorithms
      </Button>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SchemaIcon sx={{ fontSize: 34, color: "#6366f1" }} />
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Models
            </Typography>
          </Box>

          <Typography sx={{ opacity: 0.7, color: "#475569", mt: 0.5 }}>
            Manage uploaded ML models, workflows, and assets
          </Typography>
        </Box>

        {/* CREATE BUTTON */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{
              px: 3,
              py: 1.25,
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0px 8px 22px rgba(99,102,241,0.35)",
            }}
          >
            New Model
          </Button>
        </motion.div>
      </Box>

      {/* SEARCH BAR */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1.15,
            borderRadius: "12px",
            width: "330px",
            background: "white",
            border: "1px solid rgba(0,0,0,0.05)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <SearchIcon sx={{ opacity: 0.6, mr: 1.2 }} />
          <input
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
              fontSize: "0.95rem",
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={3}>
        {models.map((model) => (
          <Grid item key={model.id} xs={12} md={4}>
            <ModelCard model={model} onDelete={deleteModel} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <Box p={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Model
          </Typography>
          <Divider sx={{ my: 2, opacity: 0.2 }} />

          <TextField
            fullWidth
            label="Model Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Box mt={3} display="flex" gap={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => setOpen(false)}
              sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={createModel}
              sx={{
                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              Create
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Container>
  )
}
