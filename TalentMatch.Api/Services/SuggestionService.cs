using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class SuggestionService
    {
        public List<string> ExtractSuggestions(AiEvaluationResponse ai)
        {
            var suggestions = new List<string>();

            AddLines(ai.Skills.Reason, suggestions);
            AddLines(ai.TechStack.Reason, suggestions);
            AddLines(ai.Projects.Reason, suggestions);
            AddLines(ai.Experience.Reason, suggestions);
            AddLines(ai.Overall.Reason, suggestions);

            return suggestions.Distinct().Take(6).ToList();
        }

        private void AddLines(string text, List<string> list)
        {
            if (string.IsNullOrWhiteSpace(text))
                return;

            var lines = text.Split('\n', StringSplitOptions.RemoveEmptyEntries);

            foreach (var line in lines)
            {
                if (line.Length > 15) // filter tiny lines
                    list.Add(line.Trim());
            }
        }
    }
}