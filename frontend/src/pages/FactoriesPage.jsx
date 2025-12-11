"use client"

import { useEffect, useState } from "react"
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
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { motion } from "framer-motion"
import axiosInstance from "../api/axiosInstance"
import FactoryCard from "../components/FactoryCard"

export default function FactoriesPage() {
  const [factories, setFactories] = useState([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" })

  useEffect(() => {
    fetchFactories()
  }, [])

  const fetchFactories = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get("/factories")
      setFactories(res.data)
    } catch (err) {
      setSnack({ open: true, msg: "Failed to load factories", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const deleteFactory = async (id) => {
    try {
    setLoading(true);

    const res = await axiosInstance.delete(`/factories/${id}`);

    // Remove factory from UI
    setFactories((prev) => prev.filter((f) => f.id !== id));

    setSnack({
      open: true,
      msg: "Factory deleted successfully",
      type: "success",
    });
  } catch (err) {
    setSnack({
      open: true,
      msg: "Failed to delete factory",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};


  const createFactory = async () => {
    try {
      setCreating(true)
      await axiosInstance.post("/factories", { name, description })
      setSnack({ open: true, msg: "Factory created successfully", type: "success" })
      setOpen(false)
      setName("")
      setDescription("")
      fetchFactories()
    } catch (err) {
      setSnack({ open: true, msg: "Failed to create factory", type: "error" })
    } finally {
      setCreating(false)
    }
  }

  return (
    <Container maxWidth="lg">
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
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 0.5,
            }}
          >
            Factories
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
            Manage all your production facilities
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            transition: "all 0.2s ease",
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)",
            },
          }}
        >
          Create Factory
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress sx={{ color: "#3b82f6" }} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && factories.length === 0 && (
        <Box textAlign="center" mt={8} color="text.secondary">
          <Typography variant="h6" sx={{ mb: 1 }}>
            No factories found
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Create your first factory to get started
          </Typography>
        </Box>
      )}

      {/* Factory Grid */}
      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        {factories.map((factory) => (
          <Grid item key={factory.id} xs={12} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <FactoryCard factory={factory} onDelete={deleteFactory} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Create Factory Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <Box p={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create New Factory
          </Typography>
          <Divider sx={{ my: 2, opacity: 0.2 }} />

          <TextField
            fullWidth
            label="Factory Name"
            placeholder="Enter factory name"
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
            placeholder="Enter the description"
            margin="normal"
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
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              disabled={!name || creating}
              onClick={createFactory}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "8px",
              }}
            >
              {creating ? <CircularProgress size={22} /> : "Create"}
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.type} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}
