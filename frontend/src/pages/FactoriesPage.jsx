import { useEffect, useState } from "react";
import { Button, Typography, Grid, Dialog, TextField } from "@mui/material";
import axiosInstance from "../api/axiosInstance";
import FactoryCard from "../components/FactoryCard";

export default function FactoriesPage() {
  const [factories, setFactories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchFactories();
  }, []);

  const fetchFactories = async () => {
    const res = await axiosInstance.get("/factories");
    setFactories(res.data);
  };

  const createFactory = async () => {
    await axiosInstance.post("/factories", { name });
    setOpen(false);
    setName("");
    fetchFactories();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Factories
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Create New Factory
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {factories.map((factory) => (
          <Grid item key={factory.id} xs={12} md={4}>
            <FactoryCard factory={factory} />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div style={{ padding: 20 }}>
          <Typography>Create Factory</Typography>
          <TextField
            fullWidth
            label="Factory Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button fullWidth variant="contained" onClick={createFactory}>
            Create
          </Button>
        </div>
      </Dialog>
    </>
  );
}
