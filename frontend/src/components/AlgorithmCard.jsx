"use client"

import { Card, CardContent, Typography, Button, Stack, IconButton, Divider, Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useState } from "react"

export default function AlgorithmCard({ algorithm, onDelete }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  return (
    <Card
      sx={{
        minWidth: 340,
        width: "100%",
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(239, 68, 68, 0.08))",
        border: "1px solid rgba(245, 158, 11, 0.15)",
        borderRadius: "14px",
        transition: "0.3s ease",
        position: "relative",
        overflow: "hidden",
        ":hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(245,158,11,0.35)",
          boxShadow: "0 20px 50px rgba(239,68,68,0.15)",
        },
      }}
      elevation={3}
    >
      <CardContent sx={{ pb: 1.5, flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            fontSize: "1.15rem",
          }}
        >
          {algorithm.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            lineHeight: 1.6,
            minHeight: "2.6rem",
            mb: 2,
          }}
        >
          {algorithm.description || "No description"}
        </Typography>

        <Typography
          variant="caption"
          display="block"
          sx={{
            color: "text.secondary",
            opacity: 0.65,
            textTransform: "uppercase",
            letterSpacing: "0.6px",
          }}
        >
          Created: {new Date(algorithm.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Divider sx={{ opacity: 0.2 }} />

      {/* ACTION BUTTONS */}
      <Box
        sx={{
          p: 1.75,
          display: "flex",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >

        {/* VIEW MODELS BUTTON */}
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(245, 158, 11, 0.3)",
            },
          }}
          onClick={() => navigate(`/algorithm/${algorithm.id}`)}
        >
          View Models
        </Button>

        {/* DELETE BUTTON */}
        <IconButton
          size="small"
          disabled={deleting}
          sx={{
            color: deleting ? "#fca5a5" : "#ef4444",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            ":hover": {
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              borderColor: "rgba(239, 68, 68, 0.5)",
            },
          }}
          onClick={() => onDelete(algorithm.id)}
        >
          <DeleteOutlineIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </Box>
    </Card>
  )
}
