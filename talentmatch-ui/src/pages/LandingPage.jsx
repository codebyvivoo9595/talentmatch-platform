import { Container, Typography, Button } from "@mui/material";

const LandingPage = () => {
  return (
    <Container sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h3" gutterBottom>
        TalentMatch
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        AI-powered Resume & Job Description Matching
      </Typography>

      <Button variant="contained" size="large" sx={{ mt: 4 }}>
        Check Match
      </Button>
    </Container>
  );
};

export default LandingPage;