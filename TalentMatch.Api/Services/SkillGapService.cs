using System.Text.RegularExpressions;
using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class SkillGapService
    {
        public List<string> DetectMissingSkills(
            string jobDescription,
            AiEvaluationResponse ai)
        {
            var missingSkills = new List<string>();

            var techKeywords = new[]
            {
                "docker","kubernetes","aws","azure","gcp",
                "react","angular","vue","node","microservices",
                "redis","kafka","rabbitmq","terraform",
                "devops","ci/cd","jenkins","gitlab"
            };

            var jd = jobDescription.ToLower();

            foreach (var skill in techKeywords)
            {
                if (jd.Contains(skill))
                {
                    if (IsWeak(ai))
                    {
                        missingSkills.Add(
                            char.ToUpper(skill[0]) + skill.Substring(1));
                    }
                }
            }

            return missingSkills.Distinct().Take(6).ToList();
        }

        private bool IsWeak(AiEvaluationResponse ai)
        {
            return ai.TechStack.Score <= 2 || ai.Skills.Score <= 2;
        }
    }
}