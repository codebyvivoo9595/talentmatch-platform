namespace TalentMatch.Api.Domain.Entities
{
    public class AnalysisResult
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public int SkillsScore { get; set; }
        public int TechStackScore { get; set; }
        public int ProjectsScore { get; set; }
        public int ExperienceScore { get; set; }
        public int OverallScore { get; set; }

        public double FinalPercentage { get; set; }

        public string AiResponse { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
