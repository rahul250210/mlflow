"use client"

import { Card, CardContent, Typography, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"

export default function ModelCard({ model }) {
  const navigate = useNavigate()

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: "12px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        },
        ":hover": {
          "&::before": {
            opacity: 1,
          },
          elevation: 12,
          transform: "translateY(-6px)",
          borderColor: "rgba(99, 102, 241, 0.3)",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.15)",
        },
      }}
      elevation={2}
    >
      <CardContent sx={{ pb: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            fontSize: "1.1rem",
          }}
        >
          {model.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6, flex: 1, minHeight: "2.8rem" }}
        >
          {model.description || "No description"}
        </Typography>

        <Typography
          variant="caption"
          display="block"
          sx={{
            mt: 2,
            color: "text.secondary",
            fontSize: "0.75rem",
            opacity: 0.6,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 500,
          }}
        >
          Created: {new Date(model.created_at).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2.5 }}>
          <Button
            variant="contained"
            fullWidth
            endIcon={<ArrowForwardIcon sx={{ fontSize: "0.9rem" }} />}
            sx={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              transition: "all 0.2s ease",
              fontSize: "0.95rem",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
              },
            }}
            onClick={() => navigate(`/model/${model.id}`)}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
