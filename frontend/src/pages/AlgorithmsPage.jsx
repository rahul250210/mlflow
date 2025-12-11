"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button, Typography, Grid, Dialog, TextField, Box, Container, Divider } from "@mui/material"
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

  useEffect(() => {
    const fetchAlgorithms = async () => {
      const res = await axiosInstance.get(`/algorithms/factory/${factoryId}`)
      setAlgorithms(res.data)
    }

    fetchAlgorithms()
  }, [factoryId])

  const fetchAlgorithms = async () => {
    const res = await axiosInstance.get(`/algorithms/factory/${factoryId}`)
    setAlgorithms(res.data)
  }

  const createAlgorithm = async () => {
    await axiosInstance.post(`/algorithms/${factoryId}`, {
      name,
      description,
    })
    setOpen(false)
    setName("")
    setDescription("")
    fetchAlgorithms()
  }

  return (
    <Container maxWidth="lg">
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{
          mb: 2,
          textTransform: "none",
          color: "#3b82f6",
          fontWeight: 600,
          ":hover": {
            backgroundColor: "rgba(59, 130, 246, 0.08)",
          },
        }}
      >
        Back to Factories
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
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
            },
          }}
        >
          Create Algorithm
        </Button>
      </Box>

      <Grid container spacing={3}>
        {algorithms.map((algo) => (
          <Grid item key={algo.id} xs={12} md={4}>
            <AlgorithmCard algorithm={algo} />
          </Grid>
        ))}
      </Grid>

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
    </Container>
  )
}
