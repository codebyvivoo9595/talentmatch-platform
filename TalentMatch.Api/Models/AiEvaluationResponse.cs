using System.Text.Json.Serialization;

namespace TalentMatch.Api.Models
{
    public class ScoreDetail
    {
        public int Score { get; set; }

        public string Reason { get; set; } = "";
    }

    public class AiEvaluationResponse
    {
        [JsonPropertyName("skills")]
        public ScoreDetail Skills { get; set; } = new();

        [JsonPropertyName("techStack")]
        public ScoreDetail TechStack { get; set; } = new();

        [JsonPropertyName("projects")]
        public ScoreDetail Projects { get; set; } = new();

        [JsonPropertyName("experience")]
        public ScoreDetail Experience { get; set; } = new();

        [JsonPropertyName("overall")]
        public ScoreDetail Overall { get; set; } = new();

        public List<string> MissingSkills { get; set; } = new();
    }
}