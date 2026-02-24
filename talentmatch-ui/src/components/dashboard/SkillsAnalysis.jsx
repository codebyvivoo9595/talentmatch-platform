import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

const matchedSkills = ["React", ".NET Core", "SQL", "REST APIs"];
const missingSkills = ["Docker", "CI/CD", "Azure"];

const SkillsAnalysis = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills Analysis
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2">Matched Skills</Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {matchedSkills.map((skill) => (
              <Chip key={skill} label={skill} color="success" />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2">Missing Skills</Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {missingSkills.map((skill) => (
              <Chip key={skill} label={skill} color="warning" />
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillsAnalysis;