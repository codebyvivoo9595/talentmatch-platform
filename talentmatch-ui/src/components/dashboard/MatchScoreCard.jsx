import { Card, CardContent, Typography, Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const MATCH_SCORE = 72; // mock data

const MatchScoreCard = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Match Score
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex", my: 2 }}>
          <CircularProgress
            variant="determinate"
            value={MATCH_SCORE}
            size={120}
            thickness={4}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {MATCH_SCORE}%
            </Typography>
          </Box>
        </Box>

        <Typography color="text.secondary">
          Good match! Some improvements recommended.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MatchScoreCard;