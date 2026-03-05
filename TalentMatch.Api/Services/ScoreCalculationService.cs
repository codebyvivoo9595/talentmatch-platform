namespace TalentMatch.Api.Services
{
    public class ScoreCalculationService
    {
        public double CalculateFinalScore(
            int skills,
            int techStack,
            int projects,
            int experience,
            int overall)
        {
            double skillsWeight = 0.30;
            double techWeight = 0.30;
            double projectWeight = 0.20;
            double expWeight = 0.10;
            double overallWeight = 0.10;

            var finalScore =
                ((skills / 5.0) * skillsWeight) +
                ((techStack / 5.0) * techWeight) +
                ((projects / 5.0) * projectWeight) +
                ((experience / 5.0) * expWeight) +
                ((overall / 5.0) * overallWeight);

            return finalScore * 100;
        }
    }
}

