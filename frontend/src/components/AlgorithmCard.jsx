import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AlgorithmCard({ algorithm }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{algorithm.name}</Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {algorithm.description || "No description"}
        </Typography>

        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Created: {new Date(algorithm.created_at).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/algorithm/${algorithm.id}`)}
          >
            View Models
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
