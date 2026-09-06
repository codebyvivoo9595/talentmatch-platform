import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext(null);

/**
 * Stores the latest analysis result returned by POST /api/analyze.
 * DashboardPage reads from here instead of using mock data.
 *
 * Shape of result:
 * {
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
 * }
 */
export const AnalysisProvider = ({ children }) => {
  const [result, setResult] = useState(null);

  return (
    <AnalysisContext.Provider value={{ result, setResult }}>
      {children}
    </AnalysisContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return ctx;
};
