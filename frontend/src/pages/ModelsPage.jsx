"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Typography, Grid, Dialog, TextField, Box, Container, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import axiosInstance from "../api/axiosInstance"
import ModelCard from "../components/ModelCard"

export default function ModelsPage() {
  const { algorithmId } = useParams()
  const navigate = useNavigate()

  const [models, setModels] = useState([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    const fetchModels = async () => {
      const res = await axiosInstance.get(`/models/algorithm/${algorithmId}`)
      setModels(res.data)
    }

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
    <Container maxWidth="lg">
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "#6366f1",
          fontWeight: 600,
          ":hover": {
            backgroundColor: "rgba(99, 102, 241, 0.08)",
          },
        }}
      >
        Back to Algorithms
      </Button>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          pb: 2,
          borderBottom: "1px solid rgba(226, 232, 240, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Models
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
            },
          }}
        >
          Create Model
        </Button>
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
