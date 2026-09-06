import * as XLSX from "xlsx";

/**
 * Generates and downloads an Excel file from the analysis result.
 * Only available to signed-up (authenticated) users.
 *
 * @param {object} result - The analysis result from AnalysisContext
 */
export const downloadAnalysisExcel = (result) => {
  if (!result) return;

  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Summary ──────────────────────────────────────────────────────
  const summaryData = [
    ["TalentMatch Analysis Report"],
    ["Generated on", new Date().toLocaleString()],
    [],
    ["OVERALL MATCH SCORE", `${Math.round(result.finalPercentage)}%`],
    [],
    ["CATEGORY SCORES (out of 5)"],
    ["Category", "Score", "Max"],
    ["Skills", result.aiResponse?.skills?.score ?? "-", 5],
    ["Tech Stack", result.aiResponse?.techStack?.score ?? "-", 5],
    ["Projects", result.aiResponse?.projects?.score ?? "-", 5],
    ["Experience", result.aiResponse?.experience?.score ?? "-", 5],
    ["Overall Fit", result.aiResponse?.overall?.score ?? "-", 5],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Column widths
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 15 }, { wch: 10 }];

  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  // ── Sheet 2: AI Feedback ─────────────────────────────────────────────────
  const feedbackData = [
    ["CATEGORY", "SCORE", "AI FEEDBACK"],
    ...["skills", "techStack", "projects", "experience", "overall"].map(
      (key) => {
        const label =
          key === "techStack"
            ? "Tech Stack"
            : key.charAt(0).toUpperCase() + key.slice(1);
        const data = result.aiResponse?.[key];
        return [
          label,
          data?.score ?? "-",
          data?.reason?.replace(/\n/g, " | ") ?? "-",
        ];
      }
    ),
  ];

  const feedbackSheet = XLSX.utils.aoa_to_sheet(feedbackData);
  feedbackSheet["!cols"] = [{ wch: 15 }, { wch: 8 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, feedbackSheet, "AI Feedback");

  // ── Sheet 3: Missing Skills ──────────────────────────────────────────────
  const missingSkillsData = [
    ["MISSING SKILLS"],
    ["Skill"],
    ...(result.missingSkills ?? []).map((skill) => [skill]),
  ];

  if ((result.missingSkills ?? []).length === 0) {
    missingSkillsData.push(["No missing skills — great match!"]);
  }

  const skillsSheet = XLSX.utils.aoa_to_sheet(missingSkillsData);
  skillsSheet["!cols"] = [{ wch: 30 }];
  XLSX.utils.book_append_sheet(wb, skillsSheet, "Missing Skills");

  // ── Sheet 4: Suggestions ─────────────────────────────────────────────────
  const suggestionsData = [
    ["AI SUGGESTIONS"],
    ["#", "Suggestion"],
    ...(result.suggestions ?? []).map((s, i) => [i + 1, s]),
  ];

  if ((result.suggestions ?? []).length === 0) {
    suggestionsData.push(["", "No specific suggestions — excellent match!"]);
  }

  const suggestionsSheet = XLSX.utils.aoa_to_sheet(suggestionsData);
  suggestionsSheet["!cols"] = [{ wch: 5 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, suggestionsSheet, "Suggestions");

  // ── Download ──────────────────────────────────────────────────────────────
  const fileName = `TalentMatch_Report_${new Date()
    .toISOString()
    .slice(0, 10)}.xlsx`;

  XLSX.writeFile(wb, fileName);
};
