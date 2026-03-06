
    namespace TalentMatch.Api.Models
    {
        public class AiEvaluationResponse
        {
            public Category skills { get; set; } = new();
            public Category techStack { get; set; } = new();
            public Category projects { get; set; } = new();
            public Category experience { get; set; } = new();
            public Category overall { get; set; } = new();
        }

        public class Category
        {
            public int score { get; set; }
            public string reason { get; set; } = "";
            public List<string> suggestions { get; set; } = new();
        }
    }


