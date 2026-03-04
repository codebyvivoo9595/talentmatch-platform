namespace TalentMatch.Api.Application.Interfaces
{
    public interface IScoreCalculator
    {
        ScoreResult Calculate(string resumeText, string jobDescription);
    }

    public class ScoreResult
    {
        public int Skills { get; set; }
        public int TechStack { get; set; }
        public int Projects { get; set; }
        public int Experience { get; set; }
        public int Overall { get; set; }

        public double FinalPercentage { get; set; }
    }
}
