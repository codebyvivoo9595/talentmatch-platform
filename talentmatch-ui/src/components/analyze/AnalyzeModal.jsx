import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ResumeUploadStep from "./ResumeUploadStep";
import JobDescriptionStep from "./JobDescriptionStep";
import ReviewAnalyzeStep from "./ReviewAnalyzeStep";

const steps = ["Upload Resume", "Add Job Description", "Review & Analyze"];

const AnalyzeModal = ({ open, onClose, onComplete }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      onClose();
      onComplete({
        resumeFile,
        jobDescription,
      });
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <ResumeUploadStep file={resumeFile} setFile={setResumeFile} />;
      case 1:
        return (
          <JobDescriptionStep
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        );
      case 2:
        return (
          <ReviewAnalyzeStep
            resumeFile={resumeFile}
            jobDescription={jobDescription}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Resume Job Match Analysis</DialogTitle>

      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        <Box sx={{ minHeight: 120 }}>{renderStepContent()}</Box>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 4,
          }}
        >
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          {/* <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Analyze" : "Next"}
          </Button> */}

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !resumeFile) ||
              (activeStep === 1 && jobDescription.length < 100)
            }
          >
            {activeStep === steps.length - 1 ? "Analyze" : "Next"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeModal;
