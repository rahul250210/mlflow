"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Grid,
  Dialog,
  TextField,
  Container,
  Box,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";
import axiosInstance from "../api/axiosInstance";
import FactoryCard from "../components/FactoryCard";
import FactoryIcon from "@mui/icons-material/Factory";
import SearchIcon from "@mui/icons-material/Search";

export default function FactoriesPage() {
  const [factories, setFactories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    type: "success",
  });
  const [search, setSearch] = useState("");
  const isDuplicateName = factories.some(
    (factory) => factory.name.toLowerCase().trim() === name.toLowerCase().trim()
  );
  useEffect(() => {
    fetchFactories();
  }, []);

  const fetchFactories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/factories");
      setFactories(res.data);
    } catch {
      setSnack({
        open: true,
        msg: "Failed to load factories",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFactory = async (id) => {
  try {
    setLoading(true);
    await axiosInstance.delete(`/factories/${id}`);

    setFactories((prev) => prev.filter((f) => f.id !== id));

    // 🔥 Notify sidebar
    window.dispatchEvent(new Event("factory-updated"));

    setSnack({ open: true, msg: "Factory deleted successfully", type: "success" });
  } catch {
    setSnack({ open: true, msg: "Failed to delete factory", type: "error" });
  } finally {
    setLoading(false);
  }
};

 const createFactory = async () => {
  if (isDuplicateName) {
        setSnack({
          open: true,
          msg: "Factory with this name already exists",
          type: "error",
        });
        return;
   }

  try {
    setCreating(true);
   

    await axiosInstance.post("/factories", { name, description });

    // update UI
    fetchFactories();

    // 🔥 Notify sidebar
    window.dispatchEvent(new Event("factory-updated"));

    setSnack({
      open: true,
      msg: "Factory created successfully",
      type: "success",
    });

    setOpen(false);
    setName("");
    setDescription("");

  } catch {
    setSnack({
      open: true,
      msg: "Failed to create factory",
      type: "error",
    });
  } finally {
    setCreating(false);
  }
};

const filteredFactories = factories.filter((factory) =>
  factory.name.toLowerCase().includes(search.toLowerCase())
);

 return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 6 }}>

      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FactoryIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
            <Typography
              variant="h4"
              fontWeight="800"
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
              }}
            >
              Factories
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{ opacity: 0.7, color: "#475569", mt: 0.5 }}
          >
            Manage all factories, workflows & deployments
          </Typography>
        </motion.div>

        {/* Create Button */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => setOpen(true)}
           
            sx={{
              px: 3,
              py: 1.3,
              textTransform: "none",
              borderRadius: "12px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              boxShadow: "0px 8px 22px rgba(91,135,255,0.35)",
              
            }}
          >
            New Factory
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
            placeholder="Search factories..."
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
  {!loading && factories.length > 0 && filteredFactories.length === 0 && (
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
      No matching factories
    </Typography>
    <Typography sx={{ opacity: 0.6, mt: 1 }}>
      Try a different search keyword.
    </Typography>
  </motion.div>
)}

      {/* Factory Cards */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {filteredFactories.map((factory) => (
          <Grid item xs={12} sm={6} md={4} key={factory.id}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              whileHover={{ scale: 1.02 }}
            >
              <FactoryCard factory={factory} onDelete={deleteFactory} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

   
      {/* Create Factory Modal */}
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      p: 1,
      borderRadius: "20px",
      backdropFilter: "blur(25px)",
      background: "rgba(255,255,255,0.35)", // More visible!
      border: "1px solid rgba(255,255,255,0.25)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
      color: "#0f172a", // FIXED TEXT VISIBILITY
    },
  }}
>
  <Box p={3.2}>
    <Typography
      variant="h6"
      fontWeight={800}
      sx={{
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Create Factory
    </Typography>

    <Divider sx={{ my: 2, opacity: 0.25 }} />

    <TextField
      fullWidth
      label="Factory Name"
      margin="dense"
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={Boolean(name.trim()) && isDuplicateName}
      helperText={
          Boolean(name.trim()) && isDuplicateName
            ? "A factory with this name already exists"
            : ""
        }
      InputLabelProps={{ sx: { color: "#1e293b", fontWeight: 500 } }} // FIX
      sx={{
        mt: 1,
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          background: "rgba(255,255,255,0.65)", // Better contrast
          color: "#0f172a", // Text inside input
        },
      }}
    />

    <TextField
      fullWidth
      label="Description"
      margin="dense"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      InputLabelProps={{ sx: { color: "#1e293b", fontWeight: 500 } }} // FIX
      sx={{
        mt: 1,
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          background: "rgba(255,255,255,0.65)",
          color: "#0f172a",
        },
      }}
    />

    <Box mt={3} display="flex" gap={2}>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setOpen(false)}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          color: "#0f172a", // FIX
          borderColor: "rgba(0,0,0,0.2)",
        }}
      >
        Cancel
      </Button>

      <Button
          fullWidth
          variant="contained"
          disabled={!name.trim() || isDuplicateName || creating}
          onClick={createFactory}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            color: "white",
            opacity: !name.trim() || isDuplicateName ? 0.6 : 1,
          }}
        >
          {creating ? <CircularProgress size={22} /> : "Create"}
        </Button>

    </Box>
  </Box>
</Dialog>


      {/* Snackbar */}
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
