using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class ScoreCalculationService
    {
        public double Calculate(AiEvaluationResponse ai)
        {
            if (ai == null) return 0;

            return
                ((ai.Skills?.Score ?? 0) / 5.0) * 30 +
                ((ai.TechStack?.Score ?? 0) / 5.0) * 30 +
                ((ai.Projects?.Score ?? 0) / 5.0) * 20 +
                ((ai.Experience?.Score ?? 0) / 5.0) * 10 +
                ((ai.Overall?.Score ?? 0) / 5.0) * 10;
        }
    }
}