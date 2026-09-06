import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useAnalysis } from "../../context/AnalysisContext";

/**
 * Extracts matched skills by parsing the AI reason text.
 * The AI returns reasons like "Candidate has React, .NET Core, SQL skills."
 * We pull out capitalised or known tech words as a best-effort matched set.
 * The definitive missing skills list comes directly from the API.
 */
const extractMatchedSkills = (aiResponse) => {
  if (!aiResponse) return [];

  // Collect all reason text from all categories
  const allReason = [
    aiResponse.skills?.reason,
    aiResponse.techStack?.reason,
    aiResponse.projects?.reason,
    aiResponse.experience?.reason,
    aiResponse.overall?.reason,
  ]
    .filter(Boolean)
    .join(" ");

  // Simple heuristic: words that start with uppercase and are >= 2 chars,
  // are not common English sentence starters, and appear in the reason text.
  const techPattern = /\b([A-Z][A-Za-z0-9#+./-]{1,})\b/g;
  const stopWords = new Set([
    "The", "This", "Candidate", "Has", "Have", "Good", "Strong", "Excellent",
    "Skills", "Score", "Match", "Job", "No", "Not", "Some", "Few", "All",
    "Experience", "Projects", "Tech", "Stack", "Overall", "Fit",
  ]);

  const matched = new Set();
  let m;
  while ((m = techPattern.exec(allReason)) !== null) {
    const word = m[1];
    if (!stopWords.has(word) && word.length >= 2) {
      matched.add(word);
    }
  }

  return [...matched].slice(0, 10);
};

const SkillsAnalysis = () => {
  const { result } = useAnalysis();

  if (!result) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Skills Analysis
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Run an analysis to see your skill gaps.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const missingSkills = result.missingSkills ?? [];
  const matchedSkills = extractMatchedSkills(result.aiResponse);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills Analysis
        </Typography>

        {/* Matched Skills */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Matched Skills
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill) => (
                <Chip key={skill} label={skill} color="success" size="small" />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No matched skills extracted.
              </Typography>
            )}
          </Box>
        </Box>

        {/* Missing Skills */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Missing Skills
          </Typography>
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {missingSkills.length > 0 ? (
              missingSkills.map((skill) => (
                <Chip key={skill} label={skill} color="warning" size="small" />
              ))
            ) : (
              <Typography variant="body2" color="success.main">
                No critical skill gaps detected!
              </Typography>
            )}
          </Box>
        </Box>

        {/* AI Reasons per category */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            AI Feedback
          </Typography>
          {[
            { label: "Skills", data: result.aiResponse?.skills },
            { label: "Tech Stack", data: result.aiResponse?.techStack },
            { label: "Projects", data: result.aiResponse?.projects },
            { label: "Experience", data: result.aiResponse?.experience },
            { label: "Overall Fit", data: result.aiResponse?.overall },
          ].map(({ label, data }) =>
            data?.reason ? (
              <Box key={label} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {label} ({data.score}/5)
                </Typography>
                {data.reason.split("\n").map((line, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    • {line}
                  </Typography>
                ))}
              </Box>
            ) : null
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillsAnalysis;
