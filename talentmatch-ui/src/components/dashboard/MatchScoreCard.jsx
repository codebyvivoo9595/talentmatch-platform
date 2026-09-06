import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import { useAnalysis } from "../../context/AnalysisContext";

// Returns a label and color based on the score percentage
const getScoreLabel = (score) => {
  if (score >= 80) return { label: "Excellent match!", color: "success.main" };
  if (score >= 60) return { label: "Good match! Some improvements recommended.", color: "warning.main" };
  if (score >= 40) return { label: "Moderate match. Focus on the skill gaps.", color: "warning.main" };
  return { label: "Low match. Significant improvements needed.", color: "error.main" };
};

const MatchScoreCard = () => {
  const { result } = useAnalysis();

  // Show placeholder if no analysis has been run yet
  if (!result) {
    return (
      <Card sx={{ height: "100%" }}>
        <CardContent sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Match Score
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 4 }}>
            Run an analysis to see your score.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const score = Math.round(result.finalPercentage);
  const { label, color } = getScoreLabel(score);

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          Match Score
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex", my: 2 }}>
          <CircularProgress
            variant="determinate"
            value={score}
            size={120}
            thickness={4}
            color={score >= 60 ? "success" : score >= 40 ? "warning" : "error"}
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
              {score}%
            </Typography>
          </Box>
        </Box>

        <Typography color={color}>{label}</Typography>

        {/* Category breakdown */}
        <Box sx={{ mt: 3, textAlign: "left" }}>
          {[
            { label: "Skills", score: result.aiResponse?.skills?.score },
            { label: "Tech Stack", score: result.aiResponse?.techStack?.score },
            { label: "Projects", score: result.aiResponse?.projects?.score },
            { label: "Experience", score: result.aiResponse?.experience?.score },
            { label: "Overall Fit", score: result.aiResponse?.overall?.score },
          ].map(({ label, score: catScore }) => (
            <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {catScore ?? "-"} / 5
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MatchScoreCard;
