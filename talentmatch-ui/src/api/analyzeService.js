import api from "./axiosInstance";

/**
 * Analyze a resume PDF against a job description.
 *
 * Sends multipart/form-data to POST /api/analyze.
 *
 * @param {File} resumeFile   - The PDF file object from the file input
 * @param {string} jobDescription - The job description text
 * @returns {Promise<{
 *   id: string,
 *   finalPercentage: number,
 *   aiResponse: {
 *     skills:     { score: number, reason: string },
 *     techStack:  { score: number, reason: string },
 *     projects:   { score: number, reason: string },
 *     experience: { score: number, reason: string },
 *     overall:    { score: number, reason: string },
 *     missingSkills: string[]
 *   },
 *   suggestions: string[],
 *   missingSkills: string[]
 * }>}
 */
export const analyzeResume = async (resumeFile, jobDescription) => {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription);

  const response = await api.post("/analyze", formData, {
    headers: {
      // Override Content-Type so axios sets the correct multipart boundary
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
