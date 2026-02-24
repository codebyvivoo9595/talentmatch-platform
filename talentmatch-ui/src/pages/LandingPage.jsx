import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import InsightsIcon from "@mui/icons-material/Insights";
import { motion } from "framer-motion";
import { useState } from "react";
import AnalyzeModal from "../components/analyze/AnalyzeModal";
import { useNavigate } from "react-router-dom";
import { fadeUp } from "../animations/motionVariants";

const LandingPage = () => {
  const [openAnalyze, setOpenAnalyze] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 64px)", // AppBar height
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.75))",
          }}
        />

        {/* Hero Content */}
        {/* <Box sx={{ position: "relative", zIndex: 1, px: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Match Your Resume with the Right Job
            </Typography>

            <Typography variant="h6" sx={{ mb: 5, maxWidth: 700, mx: "auto" }}>
              AI-powered resume & job description matching with actionable
              insights to boost your chances.
            </Typography>

            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                sx={{ px: 5, py: 1.5, fontSize: "1rem" }}
                onClick={() => setOpenAnalyze(true)}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        </Box> */}

        <Box sx={{ position: "relative", zIndex: 1, px: 2 }}>
          {/* Hero Heading */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Match Your Resume with the Right Job
            </Typography>
          </motion.div>

          {/* Hero Subheading */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <Typography variant="h6" sx={{ mb: 5, maxWidth: 700, mx: "auto" }}>
              AI-powered resume & job description matching with actionable
              insights to boost your chances.
            </Typography>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5, fontSize: "1rem" }}
              onClick={() => setOpenAnalyze(true)}
            >
              Get Started
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* ================= HOW IT WORKS ================= */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          How It Works
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          Just three simple steps to get AI-powered insights
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {/* STEP 1 */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <CloudUploadIcon
                    sx={{ fontSize: 50, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Upload Resume
                  </Typography>
                  <Typography color="text.secondary">
                    Securely upload your resume in PDF format.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* STEP 2 */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <DescriptionIcon
                    sx={{ fontSize: 50, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Add Job Description
                  </Typography>
                  <Typography color="text.secondary">
                    Paste or type the job description details.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* STEP 3 */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <InsightsIcon
                    sx={{ fontSize: 50, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Get AI Insights
                  </Typography>
                  <Typography color="text.secondary">
                    View match score, gaps, and improvement suggestions.
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* ================= Analyzer Logic added  ================= */}
      <AnalyzeModal
        open={openAnalyze}
        onClose={() => setOpenAnalyze(false)}
        onComplete={(data) => {
          console.log("Analysis data:", data);
          navigate("/dashboard");
        }}
      />
    </>
  );
};

export default LandingPage;
