import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ModelCard({ model }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{model.name}</Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {model.description || "No description"}
        </Typography>

        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Created: {new Date(model.created_at).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/model/${model.id}`)}
          >
            View Details
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
