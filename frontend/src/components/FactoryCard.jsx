import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FactoryCard({ factory }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{factory.name}</Typography>
        <Typography variant="body2">
          Created: {new Date(factory.created_at).toLocaleDateString()}
        </Typography>

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate(`/factory/${factory.id}`)}
        >
          View Algorithms
        </Button>
      </CardContent>
    </Card>
  );
}
