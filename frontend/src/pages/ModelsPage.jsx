"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Typography, Grid, Dialog, TextField, Box,Backdrop,CircularProgress, Container, Divider } from "@mui/material"
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
  const [versionNumber, setVersionNumber] = useState(1);
  const [stage, setStage] = useState("development");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  const isDuplicateName = models.some(
    (m) => m.name.toLowerCase().trim() === name.toLowerCase().trim()
  );

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

  if (!name.trim() || isDuplicateName) return;
  if (!name.trim()) {
    setSnack({ open: true, msg: "Model name required", type: "error" });
    return;
  }

  try {
    setLoading(true);

    await axiosInstance.post(`/models/${algorithmId}`, {
      name,
      description,
      version_number: versionNumber,
      stage,
      notes,
      tags
    });

    setSnack({ open: true, msg: "Model created successfully", type: "success" });

    setOpen(false);
    setName("");
    setDescription("");
    setVersionNumber(1);
    setStage("development");
    setNotes("");
    setTags("");

    fetchModels();
  } catch {
    setSnack({ open: true, msg: "Failed to create model", type: "error" });
  } finally {
    setLoading(false);
  }
};


  const filteredModels = models.filter((model) =>
  model.name.toLowerCase().includes(search.toLowerCase())
);

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
            py: 1.2,
            borderRadius: "12px",
            width: "330px",
            background: "white",
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <SearchIcon sx={{ mr: 1.2, opacity: 0.6 }} />
          <input
            placeholder="Search models..."
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              fontSize: "0.95rem",
              background: "transparent",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>
      </Box>
       {/* Loading Overlay */}
      <Backdrop
        open={loading}
        sx={{
          zIndex: 1000,
          color: "#fff",
          backdropFilter: "blur(4px)",
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Empty State */}
     {/* NO RESULT FOUND */}
  {!loading && models.length > 0 && filteredModels.length === 0 && (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        textAlign: "center",
        marginTop: "6rem",
        opacity: 0.9,
      }}
  >
    <Typography variant="h5" fontWeight="700">
      No matching models
    </Typography>
    <Typography sx={{ opacity: 0.6, mt: 1 }}>
      Try a different search keyword.
    </Typography>
  </motion.div>
)}
      <Grid container spacing={3}>
       {filteredModels.map((model) => (
          <Grid item key={model.id} xs={12} md={4}>
            <ModelCard model={model} onDelete={deleteModel} />
          </Grid>
        ))}
      </Grid>

     <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>

  <Box p={3}>

    {/* TITLE */}
    <Typography
      variant="h5"
      fontWeight="800"
      sx={{
        background: "linear-gradient(90deg, #6366f1, #a855f7)",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 1,
      }}
    >
      Register New Model
    </Typography>

    <Typography sx={{ opacity: 0.7, mb: 2 }}>
      Attach metadata, version control & model lifecycle settings.
    </Typography>

    <Divider sx={{ my: 1, opacity: 0.25 }} />

    {/* BASIC MODEL INFO */}
    <Typography fontWeight={700} sx={{ mb: 1 }}>
      Model Information
    </Typography>

    <TextField
      fullWidth
      label="Model Name"
      margin="dense"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={Boolean(name.trim()) && isDuplicateName}
            helperText={
              Boolean(name.trim()) && isDuplicateName
                ? "A model with this name already exists"
                : ""
            }
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      label="Description"
      margin="dense"
      multiline
      rows={3}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      sx={{ mb: 2 }}
    />

    <Divider sx={{ my: 2, opacity: 0.25 }} />

    {/* VERSION DETAILS */}
    <Typography fontWeight={700} sx={{ mb: 1 }}>
      Version Control
    </Typography>

    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={5}>
        <TextField
          fullWidth
          label="Version Number"
          type="number"
          value={versionNumber}
          onChange={(e) => setVersionNumber(Number(e.target.value))}
        />
      </Grid>

      <Grid item xs={7}>
        <TextField
          select
          fullWidth
          SelectProps={{ native: true }}
          label="Lifecycle Stage"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option value="development">Development</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </TextField>
      </Grid>
    </Grid>

    <TextField
      fullWidth
      label="Notes (optional)"
      margin="dense"
      multiline
      rows={2}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      sx={{ mb: 2 }}
    />

    {/* TAG UI IMPROVED */}
    <TextField
      fullWidth
      label="Tags"
      placeholder="model, experiment-3, baseline"
      margin="dense"
      value={tags}
      onChange={(e) => setTags(e.target.value)}
      helperText="Comma separated tags"
      sx={{ mb: 2 }}
    />

    <Divider sx={{ my: 2, opacity: 0.25 }} />

    {/* ACTION BUTTONS */}
    <Box display="flex" gap={2}>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setOpen(false)}
        sx={{
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "10px"
        }}
      >
        Cancel
      </Button>

      <Button
        fullWidth
        variant="contained"
        disabled={!name.trim() || isDuplicateName}
        
        onClick={createModel}
        sx={{
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: "10px",
        }}
      >
        Create Model
      </Button>

    </Box>

  </Box>

</Dialog>

    </Container>
  )
}
