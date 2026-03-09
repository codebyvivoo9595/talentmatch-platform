namespace TalentMatch.Api.Models
{
    public class ScoreDetail
    {
        public int score { get; set; }
        public string reason { get; set; }
    }

    public class AiEvaluationResponse
    {
        public ScoreDetail skills { get; set; }
        public ScoreDetail techStack { get; set; }
        public ScoreDetail projects { get; set; }
        public ScoreDetail experience { get; set; }
        public ScoreDetail overall { get; set; }
    }
}