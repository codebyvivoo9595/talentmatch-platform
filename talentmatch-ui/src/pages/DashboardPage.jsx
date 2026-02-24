import { Container, Typography, Grid } from "@mui/material";
import MatchScoreCard from "../components/dashboard/MatchScoreCard";
import SkillsAnalysis from "../components/dashboard/SkillsAnalysis";
import SuggestionsCard from "../components/dashboard/SuggestionsCard";

const DashboardPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Resume Match Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        AI-powered analysis of your resume against the job description
      </Typography>

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