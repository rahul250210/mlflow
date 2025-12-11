"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState } from "react";

export default function FactoryCard({ factory, onDelete }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  
  
  return (
    <Card
      sx={{
        minWidth: 340,      // ⬅️ Wider card
        width: "100%",
        background:
          "linear-gradient(135deg, rgba(23,23,23,0.85), rgba(30,41,59,0.85))",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        color: "#e5e7eb",
        transition: "0.3s ease",
        position: "relative",
        ":hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(34,197,94,0.4)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        },
      }}
      elevation={4}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#f8fafc", // darker contrast
          }}
        >
          {factory.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#cbd5e1",
            fontSize: "0.8rem",
            mb: 1.5,
            opacity: 0.7,
            letterSpacing: "0.5px",
          }}
        >
          Created: {new Date(factory.created_at).toLocaleDateString()}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 2, lineHeight: 1.6, color: "#d1d5db" }}
        >
          {factory.description}
        </Typography>
      </CardContent>

      <Divider sx={{ opacity: 0.15 }} />

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
          size="small"
          endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem" }} />}
          sx={{
            background: "linear-gradient(135deg, #22c55e, #3b82f6)",
            textTransform: "none",
            fontWeight: 600,
            flex: 1,
            ":hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(34,197,94,0.3)",
            },
          }}
          onClick={() => navigate(`/factory/${factory.id}`)}
        >
          View
        </Button>

        {/* DELETE BUTTON */}
        <IconButton
          size="small"
          disabled={deleting}
          sx={{
            color: deleting ? "#fca5a5" : "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)",
            ":hover": {
              backgroundColor: "rgba(239,68,68,0.12)",
              borderColor: "rgba(239,68,68,0.5)",
            },
          }}
          onClick={() => {onDelete(factory.id)}}
        >
          <DeleteOutlineIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </Box>
    </Card>
  );
}
