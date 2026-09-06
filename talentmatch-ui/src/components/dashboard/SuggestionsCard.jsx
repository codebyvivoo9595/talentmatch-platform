import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useAnalysis } from "../../context/AnalysisContext";

const SuggestionsCard = () => {
  const { result } = useAnalysis();

  if (!result) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            AI Suggestions
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Run an analysis to get personalized suggestions.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const suggestions = result.suggestions ?? [];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Suggestions
        </Typography>

        {suggestions.length === 0 ? (
          <Typography color="text.secondary">
            No specific suggestions — your resume is a great match!
          </Typography>
        ) : (
          <List dense>
            {suggestions.map((item, index) => (
              <ListItem key={index} alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                  <TipsAndUpdatesIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionsCard;
