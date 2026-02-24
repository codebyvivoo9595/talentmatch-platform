import { Card, CardContent, Typography, List, ListItem } from "@mui/material";

const suggestions = [
  "Add Docker experience in your resume",
  "Mention CI/CD pipeline exposure",
  "Highlight Azure deployment experience",
];

const SuggestionsCard = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          AI Suggestions
        </Typography>

        <List>
          {suggestions.map((item, index) => (
            <ListItem key={index}>
              • {item}
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SuggestionsCard;