import { Box, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const MIN_CHARS = 100;
const MAX_CHARS = 3000;

const JobDescriptionStep = ({ jobDescription, setJobDescription }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const value = e.target.value;

    if (value.length > MAX_CHARS) {
      enqueueSnackbar("Job description is too long", { variant: "warning" });
      return;
    }

    setJobDescription(value);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Paste Job Description
      </Typography>

      <TextField
        multiline
        minRows={6}
        fullWidth
        placeholder="Paste the job description here..."
        value={jobDescription}
        onChange={handleChange}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Typography
          variant="body2"
          color={
            jobDescription.length < MIN_CHARS
              ? "error.main"
              : "success.main"
          }
        >
          {jobDescription.length < MIN_CHARS
            ? `Minimum ${MIN_CHARS} characters required`
            : "Looks good ✔"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {jobDescription.length}/{MAX_CHARS}
        </Typography>
      </Box>
    </Box>
  );
};

export default JobDescriptionStep;