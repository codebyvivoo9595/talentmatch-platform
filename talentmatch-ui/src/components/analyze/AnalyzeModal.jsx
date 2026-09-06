import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import ResumeUploadStep from "./ResumeUploadStep";
import JobDescriptionStep from "./JobDescriptionStep";
import ReviewAnalyzeStep from "./ReviewAnalyzeStep";
import { analyzeResume } from "../../api/analyzeService";
import { guestAnalyzeResume } from "../../api/guestAnalyzeService";
import { useAnalysis } from "../../context/AnalysisContext";
import { useAuth } from "../../context/AuthContext";

const steps = ["Upload Resume", "Add Job Description", "Review & Analyze"];

const AnalyzeModal = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const { setResult } = useAnalysis();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Guest email is stored in sessionStorage by LoginPage
  const guestEmail = sessionStorage.getItem("guestEmail");
  const isGuest = !isLoggedIn && Boolean(guestEmail);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      try {
        let data;

        if (isLoggedIn) {
          // Authenticated user — full endpoint with JWT
          data = await analyzeResume(resumeFile, jobDescription);
        } else if (isGuest) {
          // Guest user — separate endpoint, no JWT
          data = await guestAnalyzeResume(guestEmail, resumeFile, jobDescription);

          // Show usage message from API
          if (data.guestUsage?.message) {
            const variant = data.guestUsage.isLastUse
              ? "warning"
              : data.guestUsage.isWarning
              ? "info"
              : "success";
            enqueueSnackbar(data.guestUsage.message, { variant });
          }
        } else {
          // Not logged in and no guest email — redirect to login
          enqueueSnackbar("Please sign in or continue as guest to analyze.", {
            variant: "info",
          });
          onClose();
          navigate("/login");
          return;
        }

        setResult(data);
        onClose();
        setActiveStep(0);
        setResumeFile(null);
        setJobDescription("");
        navigate("/dashboard");
      } catch (err) {
        // Handle guest limit reached (429)
        if (err.response?.status === 429) {
          enqueueSnackbar(
            err.response.data?.message ||
              "You have used all 5 free analyses. Please create an account.",
            { variant: "warning" }
          );
          onClose();
          navigate("/login");
          return;
        }
        const message =
          err.response?.data || err.message || "Analysis failed. Please try again.";
        enqueueSnackbar(String(message), { variant: "error" });
      } finally {
        setLoading(false);
      }
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleClose = () => {
    if (loading) return;
    onClose();
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

  const isNextDisabled =
    loading ||
    (activeStep === 0 && !resumeFile) ||
    (activeStep === 1 && jobDescription.length < 100);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Resume Job Match Analysis</DialogTitle>

      <DialogContent>
        {/* Guest mode badge */}
        {isGuest && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Running as guest: <strong>{guestEmail}</strong>
          </Alert>
        )}

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

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: 3, gap: 2 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Analyzing your resume with AI — this may take a few seconds...
            </Typography>
          </Box>
        )}

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0 || loading} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {loading
              ? "Analyzing..."
              : activeStep === steps.length - 1
              ? "Analyze"
              : "Next"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AnalyzeModal;
