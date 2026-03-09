using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class ScoreCalculationService
    {
        public double Calculate(AiEvaluationResponse ai)
        {
            return
                (ai.skills.score / 5.0) * 30 +
                (ai.techStack.score / 5.0) * 30 +
                (ai.projects.score / 5.0) * 20 +
                (ai.experience.score / 5.0) * 10 +
                (ai.overall.score / 5.0) * 10;
        }
    }

}

