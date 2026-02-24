import { Box, Typography, Divider, Chip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ReviewAnalyzeStep = ({ resumeFile, jobDescription }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review & Confirm
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review the details below before starting analysis
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Resume Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Resume
        </Typography>

        <Chip
          icon={<DescriptionIcon />}
          label={resumeFile?.name}
          color="primary"
          sx={{ mt: 1 }}
        />
      </Box>

      {/* JD Preview */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Job Description Preview
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            p: 2,
            borderRadius: 1,
            backgroundColor: "grey.100",
            maxHeight: 120,
            overflow: "auto",
          }}
        >
          {jobDescription.slice(0, 400)}
          {jobDescription.length > 400 && " ..."}
        </Typography>
      </Box>

      {/* Ready */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "success.main",
        }}
      >
        <CheckCircleIcon />
        <Typography variant="body2">
          Everything looks good. Ready to analyze!
        </Typography>
      </Box>
    </Box>
  );
};

export default ReviewAnalyzeStep;