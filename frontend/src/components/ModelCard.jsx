"use client";

import { Card, CardContent, Typography, Button, Stack, IconButton, Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";

export default function ModelCard({ model, onDelete }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  return (
    <Card
      sx={{
        minWidth: 340,
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: "14px",
        transition: "0.3s ease",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ":hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(99,102,241,0.35)",
          boxShadow: "0 20px 50px rgba(99,102,241,0.2)",
        },
      }}
      elevation={3}
    >
      <CardContent sx={{ pb: 1.5, flex: 1 }}>
        {/* Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            fontSize: "1.15rem",
          }}
        >
          {model.name}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: "text.secondary",
            lineHeight: 1.6,
            minHeight: "2.6rem",
            mb: 2,
          }}
        >
          {model.description || "No description"}
        </Typography>

        {/* Date */}
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
          Created: {new Date(model.created_at).toLocaleDateString()}
        </Typography>
      </CardContent>

      <Divider sx={{ opacity: 0.2 }} />

      {/* Buttons Section */}
      <Box
        sx={{
          p: 1.75,
          display: "flex",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* VIEW BUTTON */}
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(99, 102, 241, 0.3)",
            },
          }}
          onClick={() => navigate(`/model/${model.id}`)}
        >
          View Details
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
          onClick={() => onDelete(model.id)}
        >
          <DeleteOutlineIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </Box>
    </Card>
  );
}
