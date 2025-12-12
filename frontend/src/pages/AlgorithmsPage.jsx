"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Button,
  Typography,
  Grid,
  Dialog,
  TextField,
  Box,
  Container,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import AddIcon from "@mui/icons-material/Add"
import axiosInstance from "../api/axiosInstance"
import AlgorithmCard from "../components/AlgorithmCard"

export default function AlgorithmsPage() {
  const { factoryId } = useParams()
  const navigate = useNavigate()

  const [algorithms, setAlgorithms] = useState([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [snack, setSnack] = useState({ open: false, msg: "", type: "success" })

  useEffect(() => {
    fetchAlgorithms()
  }, [])

  const fetchAlgorithms = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get(`/algorithms/factory/${factoryId}`)
      setAlgorithms(res.data)
    } catch (err) {
      setSnack({ open: true, msg: "Failed to load algorithms", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const deleteAlgorithm = async (id) => {
    try {
      setLoading(true)

      await axiosInstance.delete(`/algorithms/${id}`)

      // Update UI
      setAlgorithms((prev) => prev.filter((a) => a.id !== id))

      setSnack({
        open: true,
        msg: "Algorithm deleted successfully",
        type: "success",
      })
    } catch (err) {
      setSnack({
        open: true,
        msg: "Failed to delete algorithm",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const createAlgorithm = async () => {
    try {
      await axiosInstance.post(`/algorithms/${factoryId}`, {
        name,
        description,
      })

      setSnack({ open: true, msg: "Algorithm created successfully", type: "success" })

      setOpen(false)
      setName("")
      setDescription("")
      fetchAlgorithms()
    } catch (err) {
      setSnack({ open: true, msg: "Failed to create algorithm", type: "error" })
    }
  }

  return (
    <Container maxWidth="lg">
      {/* BACK BUTTON */}
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "#f59e0b",
          fontWeight: 600,
        }}
      >
        Back to Factories
      </Button>

      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{ pb: 2, borderBottom: "1px solid rgba(226, 232, 240, 0.1)" }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Algorithms
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
          }}
        >
          Create Algorithm
        </Button>
      </Box>

      {/* LOADING */}
      {loading && (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress sx={{ color: "#f59e0b" }} />
        </Box>
      )}

      {/* GRID */}
      <Grid container spacing={3}>
        {algorithms.map((algo) => (
          <Grid item key={algo.id} xs={12} md={4}>
            <AlgorithmCard algorithm={algo} onDelete={deleteAlgorithm} />
          </Grid>
        ))}
      </Grid>

      {/* CREATE DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <Box p={3}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Create Algorithm
          </Typography>

          <Divider sx={{ my: 2, opacity: 0.2 }} />

          <TextField
            fullWidth
            label="Algorithm Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
          />

          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
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
              onClick={createAlgorithm}
              sx={{
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
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

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.type} variant="filled">
          {snack.msg}
        </Alert>
      </Snackbar>
    </Container>
  )
}
