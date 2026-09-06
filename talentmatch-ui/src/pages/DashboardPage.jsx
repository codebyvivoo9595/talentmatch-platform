import { Container, Typography, Grid, Button, Box, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import MatchScoreCard from "../components/dashboard/MatchScoreCard";
import SkillsAnalysis from "../components/dashboard/SkillsAnalysis";
import SuggestionsCard from "../components/dashboard/SuggestionsCard";
import { useAuth } from "../context/AuthContext";
import { useAnalysis } from "../context/AnalysisContext";
import { downloadAnalysisExcel } from "../utils/excelExport";

const DashboardPage = () => {
  const { isLoggedIn } = useAuth();
  const { result } = useAnalysis();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Talent Match Dashboard
          </Typography>
          <Typography color="text.secondary">
            AI-powered analysis of your resume against the job description
          </Typography>
        </Box>

        {/* Excel download — signed-up users only */}
        {isLoggedIn && result ? (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => downloadAnalysisExcel(result)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Download Report
          </Button>
        ) : !isLoggedIn && result ? (
          <Tooltip title="Create a free account to download your report as Excel">
            <span>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                disabled
                sx={{ textTransform: "none" }}
              >
                Download Report (Sign Up)
              </Button>
            </span>
          </Tooltip>
        ) : null}
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MatchScoreCard />
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <SkillsAnalysis />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <SuggestionsCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
