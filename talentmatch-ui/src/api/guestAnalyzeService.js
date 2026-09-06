import api from "./axiosInstance";

/**
 * Check how many guest uses remain for an email (does NOT consume a use).
 * Calls GET /api/v1/guestanalyze/status?email=
 * @param {string} email
 */
export const getGuestStatus = async (email) => {
  const response = await api.get("/guestanalyze/status", {
    params: { email },
  });
  return response.data;
  // { usageCount, remainingUses, isLimitReached, maxUses, message }
};

/**
 * Run a guest analysis.
 * Calls POST /api/v1/guestanalyze
 * @param {string} email
 * @param {File} resumeFile
 * @param {string} jobDescription
 */
export const guestAnalyzeResume = async (email, resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("guestEmail", email);
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);

  const response = await api.post("/guestanalyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
  // { finalPercentage, aiResponse, suggestions, missingSkills, guestUsage }
};
