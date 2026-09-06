import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Alert,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsightsIcon from "@mui/icons-material/Insights";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../context/AuthContext";
import { useAnalysis } from "../context/AnalysisContext";
import { getGuestStatus } from "../api/guestAnalyzeService";
import { fadeUp, scaleIn } from "../animations/motionVariants";

// ── Feature highlights shown on the left panel ───────────────────────────────
const features = [
  {
    icon: <CloudUploadIcon sx={{ color: "primary.main", fontSize: 32 }} />,
    title: "Upload Resume",
    desc: "Drag and drop your PDF resume in seconds.",
  },
  {
    icon: <DescriptionIcon sx={{ color: "primary.main", fontSize: 32 }} />,
    title: "Paste Job Description",
    desc: "Add any job posting and let AI do the analysis.",
  },
  {
    icon: <InsightsIcon sx={{ color: "primary.main", fontSize: 32 }} />,
    title: "AI Match Score",
    desc: "Get a detailed score across skills, experience, and more.",
  },
  {
    icon: <DownloadIcon sx={{ color: "primary.main", fontSize: 32 }} />,
    title: "Download Report",
    desc: "Export your full analysis as an Excel report (signed-up users).",
  },
];

const MAX_GUEST_USES = 5;

const LoginPage = () => {
  const [tab, setTab] = useState(0); // 0=SignIn 1=SignUp 2=Guest
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestStatus, setGuestStatus] = useState(null); // fetched on email blur

  const { login, register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // ── Tab handlers ────────────────────────────────────────────────────────
  const handleTabChange = (_, val) => {
    setTab(val);
    setEmail("");
    setPassword("");
    setGuestEmail("");
    setGuestStatus(null);
  };

  // ── Sign In ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await login(email, password);
      enqueueSnackbar("Welcome back!", { variant: "success" });
      navigate("/");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data || "Invalid credentials. Please try again.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ──────────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await register(email, password);
      enqueueSnackbar("Account created! Please sign in.", { variant: "success" });
      setTab(0);
      setEmail("");
      setPassword("");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data || "Registration failed. Try again.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Guest: fetch status when email entered ───────────────────────────────
  const handleGuestEmailBlur = async () => {
    if (!guestEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)) return;
    try {
      const status = await getGuestStatus(guestEmail);
      setGuestStatus(status);
    } catch {
      // silently ignore — status shown on analyze
    }
  };

  // ── Guest: proceed to landing (AnalyzeModal handles actual call) ─────────
  const handleGuestContinue = async (e) => {
    e.preventDefault();
    if (!guestEmail) return;

    setLoading(true);
    try {
      const status = await getGuestStatus(guestEmail);
      setGuestStatus(status);

      if (status.isLimitReached) {
        enqueueSnackbar(
          "You have used all 5 free analyses. Please create an account to continue.",
          { variant: "warning" }
        );
        setLoading(false);
        return;
      }

      // Store guest email in sessionStorage so AnalyzeModal can pick it up
      sessionStorage.setItem("guestEmail", guestEmail);
      navigate("/");
    } catch (err) {
      enqueueSnackbar(
        err.response?.data?.message || "Could not verify guest email.",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Usage bar color ──────────────────────────────────────────────────────
  const usagePercent = guestStatus
    ? (guestStatus.usageCount / MAX_GUEST_USES) * 100
    : 0;

  const usageColor =
    guestStatus?.isLimitReached
      ? "error"
      : guestStatus?.isLastUse
      ? "warning"
      : "primary";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #e3f0ff 0%, #f8f9ff 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 6 }}>

          {/* ── Left Panel: Feature Highlights ─────────────────────────────── */}
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              background: "linear-gradient(160deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%)",
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                TalentMatch
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                AI-powered resume matching. Know your fit before you apply.
              </Typography>
            </motion.div>

            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "flex-start" }}>
                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.18)",
                      borderRadius: 2,
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 48,
                    }}
                  >
                    {/* Re-colour icon white for dark background */}
                    {f.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#fff" }}>
                      {f.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.85, color: "#e3f2fd" }}>
                      {f.desc}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Grid>

          {/* ── Right Panel: Auth Forms ──────────────────────────────────── */}
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{ bgcolor: "#fff", p: { xs: 4, md: 6 }, display: "flex", flexDirection: "column", justifyContent: "center" }}
          >
            <motion.div variants={scaleIn} initial="hidden" animate="visible">
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Get Started
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sign in, create an account, or try it as a guest.
              </Typography>

              {/* Tabs */}
              <Tabs
                value={tab}
                onChange={handleTabChange}
                sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
              >
                <Tab
                  icon={<LockOutlinedIcon fontSize="small" />}
                  iconPosition="start"
                  label="Sign In"
                />
                <Tab
                  icon={<PersonOutlineIcon fontSize="small" />}
                  iconPosition="start"
                  label="Sign Up"
                />
                <Tab
                  icon={<EmailOutlinedIcon fontSize="small" />}
                  iconPosition="start"
                  label="Guest"
                />
              </Tabs>

              {/* ── Sign In Form ─────────────────────────────────────────── */}
              {tab === 0 && (
                <Box component="form" onSubmit={handleSignIn} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || !email || !password}
                    sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
                  </Button>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Don&apos;t have an account?{" "}
                    <Box component="span" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab(1)}>
                      Sign Up
                    </Box>
                  </Typography>
                </Box>
              )}

              {/* ── Sign Up Form ─────────────────────────────────────────── */}
              {tab === 1 && (
                <Box component="form" onSubmit={handleSignUp} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    required
                    inputProps={{ minLength: 6 }}
                    helperText="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading || !email || password.length < 6}
                    sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
                  </Button>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Already have an account?{" "}
                    <Box component="span" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab(0)}>
                      Sign In
                    </Box>
                  </Typography>
                </Box>
              )}

              {/* ── Guest Form ───────────────────────────────────────────── */}
              {tab === 2 && (
                <Box component="form" onSubmit={handleGuestContinue} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {/* Guest info banner */}
                  <Alert severity="info" sx={{ mb: 1 }}>
                    Guest mode gives you <strong>5 free analyses</strong> per email.
                    No password needed. Create an account for unlimited access and Excel reports.
                  </Alert>

                  <TextField
                    label="Your Email"
                    type="email"
                    fullWidth
                    required
                    value={guestEmail}
                    onChange={(e) => {
                      setGuestEmail(e.target.value);
                      setGuestStatus(null);
                    }}
                    onBlur={handleGuestEmailBlur}
                    disabled={loading}
                    helperText="We use this to track your 5 free uses."
                  />

                  {/* Usage indicator — shown after email blur */}
                  {guestStatus && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Free analyses used
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color={`${usageColor}.main`}>
                          {guestStatus.usageCount} / {MAX_GUEST_USES}
                        </Typography>
                      </Box>
                      <Tooltip title={guestStatus.message}>
                        <LinearProgress
                          variant="determinate"
                          value={usagePercent}
                          color={usageColor}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Tooltip>
                      <Typography variant="caption" color={`${usageColor}.main`} sx={{ mt: 0.5, display: "block" }}>
                        {guestStatus.message}
                      </Typography>
                    </Box>
                  )}

                  {/* Limit reached — push to sign up */}
                  {guestStatus?.isLimitReached && (
                    <Alert severity="warning">
                      You&apos;ve used all 5 free analyses.{" "}
                      <Box
                        component="span"
                        sx={{ fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => setTab(1)}
                      >
                        Create a free account
                      </Box>{" "}
                      to continue.
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="outlined"
                    size="large"
                    fullWidth
                    disabled={loading || !guestEmail || guestStatus?.isLimitReached}
                    sx={{ py: 1.5, fontWeight: 600, textTransform: "none" }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Continue as Guest"}
                  </Button>

                  <Divider />

                  <Typography variant="body2" color="text.secondary" align="center">
                    Want unlimited access + Excel reports?{" "}
                    <Box component="span" sx={{ color: "primary.main", cursor: "pointer", fontWeight: 600 }} onClick={() => setTab(1)}>
                      Sign Up Free
                    </Box>
                  </Typography>
                </Box>
              )}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
