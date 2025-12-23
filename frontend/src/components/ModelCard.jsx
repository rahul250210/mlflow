"use client";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  Box,
  Divider,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import RestoreIcon from "@mui/icons-material/Restore";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ModelCard({ model, onDelete }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [form, setForm] = useState({
    name: model.name,
    description: model.description || "",
    tags: model.tags || "",
    notes: model.notes || "",
  });

  const version = model.version_number || 1;
  const stage = model.stage?.toLowerCase();

  const canPromote = model.can_promote;
  const canRollback = model.can_rollback;

  const getStage = () => {
    switch (stage) {
      case "production":
        return { bg: "#22c55e22", text: "#16a34a" };
      case "staging":
        return { bg: "#eab30822", text: "#b45309" };
      case "development":
        return { bg: "#3b82f622", text: "#2563eb" };
      default:
        return { bg: "#64748b22", text: "#475569" };
    }
  };

  const stageStyle = getStage();

  const promoteModel = async () => {
    if (!canPromote || busy) return;
    setBusy(true);
    await axiosInstance.put(`/models/model/${model.id}/promote`);
    window.location.reload();
  };

  const rollbackModel = async () => {
    if (!canRollback || busy) return;
    setBusy(true);
    await axiosInstance.put(`/models/model/${model.id}/rollback`);
    window.location.reload();
  };

  const saveEdit = async () => {
    await axiosInstance.put(`/models/model/${model.id}`, form);
    setOpenEdit(false);
    window.location.reload();
  };

  const notesList = form.notes
    ?.split("\n")
    .filter((n) => n.trim().length > 0);

  return (
    <>
      <Card
        sx={{
          minWidth: 330,
          borderRadius: "14px",
          border: "1px solid rgba(99,102,241,0.18)",
          background:
            "linear-gradient(135deg, rgba(99,102,241,0.05), rgba(168,85,247,0.05))",
          transition: "0.3s",
          position: "relative",
          ":hover": { transform: "translateY(-6px)", boxShadow: "0 15px 50px rgba(99,102,241,.15)" },
        }}
      >
        {/* EDIT BUTTON */}
        <IconButton
          sx={{ position: "absolute", top: 8, right: 8 }}
          onClick={() => setOpenEdit(true)}
        >
          <EditIcon />
        </IconButton>

        <CardContent>
          <Typography variant="h6" fontWeight={700}
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg,#6366f1,#a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            {model.name}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1, color: "#475569" }}>
            {model.description?.trim() || "No description provided"}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={`v${version}`} size="small" />
            <Chip
              label={stage}
              size="small"
              sx={{
                bgcolor: stageStyle.bg,
                color: stageStyle.text,
                fontWeight: 600,
              }}
            />
          </Stack>

          {/* VERSION NOTES — BULLET POINTS */}
          {notesList?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" fontWeight={600}>
                Version Notes
              </Typography>
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                {notesList.map((n, i) => (
                  <li key={i}>
                    <Typography variant="body2">{n}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}

          {model.tags && (
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "flex", alignItems: "center" }}
            >
              <LabelIcon sx={{ fontSize: 14, mr: 0.5 }} />
              {model.tags}
            </Typography>
          )}
        </CardContent>

        <Divider />

        <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate(`/model/${model.id}`)}
            endIcon={<ArrowForwardIcon />}
          >
            Details
          </Button>

          <Tooltip title="Promote">
            <span>
              <IconButton disabled={!canPromote} onClick={promoteModel}>
                <UpgradeIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Rollback">
            <span>
              <IconButton disabled={!canRollback} onClick={rollbackModel}>
                <RestoreIcon />
              </IconButton>
            </span>
          </Tooltip>

          <IconButton onClick={() => onDelete(model.id)}>
            <DeleteOutlineIcon color="error" />
          </IconButton>
        </Box>
      </Card>

      {/* EDIT DIALOG */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Model</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Model Name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Tags"
            fullWidth
            margin="dense"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <TextField
            label="Version Notes (one per line)"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
