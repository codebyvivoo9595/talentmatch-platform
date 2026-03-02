import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { useSnackbar } from "notistack";

const ResumeUploadStep = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const showError = (msg) => {
    enqueueSnackbar(msg, { variant: "error" });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (droppedFile.type !== "application/pdf") {
      showError("Only PDF resumes are allowed");
      return;
    }

    setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      showError("Only PDF resumes are allowed");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      sx={{
        border: "2px dashed",
        borderColor: isDragging ? "primary.main" : "grey.400",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        backgroundColor: isDragging ? "action.hover" : "transparent",
        transition: "0.2s ease",
        cursor: "pointer",
      }}
    >
      <CloudUploadIcon sx={{ fontSize: 50, color: "primary.main", mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Drag & drop your resume here
      </Typography>

      <Typography variant="body2" color="text.secondary">
        PDF only • Max 5MB
      </Typography>

      <Button variant="outlined" component="label" sx={{ mt: 2 }}>
        Browse File
        <input
          type="file"
          hidden
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </Button>

      {file && (
        <Typography sx={{ mt: 2 }} color="success.main">
          Selected: {file.name}
        </Typography>
      )}
    </Box>
  );
};

export default ResumeUploadStep;