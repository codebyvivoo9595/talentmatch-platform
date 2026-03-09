using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class AiAnalysisService
    {
        private readonly HttpClient _httpClient;
        private readonly AISettings _settings;

        public AiAnalysisService(HttpClient httpClient, IOptions<AISettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task<AiEvaluationResponse> AnalyzeAsync(string resumeText, string jobDescription)
        {
            if (string.IsNullOrWhiteSpace(resumeText))
                throw new Exception("Resume text cannot be empty");

            if (string.IsNullOrWhiteSpace(jobDescription))
                throw new Exception("Job description cannot be empty");

            var prompt = $@"

You are an experienced technical recruiter reviewing a candidate's resume.

Your task is to evaluate how well the resume matches the job description.

--------------------------------
SCORING RULES
--------------------------------

Each category must be scored from 0 to 5.

0 = No match
1 = Very weak match
2 = Weak match
3 = Moderate match
4 = Strong match
5 = Perfect match

--------------------------------
EVALUATION CATEGORIES
--------------------------------

1. Skills Match
Compare candidate skills with the job requirements.

2. Tech Stack Match
Evaluate if the candidate's technologies match the job stack.

3. Projects Relevance
Check how relevant the candidate's projects are to the role.

4. Experience Level
Evaluate years and relevance of experience.

5. Overall Fit
General suitability for the role.

--------------------------------
EDGE CASE HANDLING
--------------------------------

If the resume text is empty, extremely short, irrelevant, or poorly formatted:
- Give low scores
- Provide helpful improvement suggestions

If the job description is unclear or missing:
- Evaluate based on general resume quality
- Mention that job requirements were unclear

If resume and job description are unrelated:
- Score appropriately
- Politely mention the mismatch

--------------------------------
STYLE RULES
--------------------------------

Suggestions must be:
- Friendly
- Supportive
- Constructive
- Light humor allowed but never insulting

--------------------------------
STRICT OUTPUT RULES
--------------------------------

1. Return ONLY valid JSON
2. Do NOT add text outside JSON
3. Follow the exact JSON structure
4. Each reason must contain EXACTLY 4 lines
5. Each line must be separated using \\n

Example:

""reason"": ""Line 1 explanation.\nLine 2 explanation.\nLine 3 explanation.\nLine 4 suggestion.""

--------------------------------
REQUIRED JSON FORMAT
--------------------------------

{{
  ""skills"": {{ ""score"": number, ""reason"": ""4 lines explanation separated by \\n"" }},
  ""techStack"": {{ ""score"": number, ""reason"": ""4 lines explanation separated by \\n"" }},
  ""projects"": {{ ""score"": number, ""reason"": ""4 lines explanation separated by \\n"" }},
  ""experience"": {{ ""score"": number, ""reason"": ""4 lines explanation separated by \\n"" }},
  ""overall"": {{ ""score"": number, ""reason"": ""4 lines explanation separated by \\n"" }}
}}

--------------------------------
INPUT DATA
--------------------------------

Resume:
{resumeText}

Job Description:
{jobDescription}
";

            var aiRawResponse = await CallAiModel(prompt);

            try
            {
                var hfResponse = JsonSerializer.Deserialize<List<HuggingFaceResponse>>(aiRawResponse);

                var generatedText = hfResponse?.FirstOrDefault()?.generated_text;

                if (string.IsNullOrWhiteSpace(generatedText))
                    throw new Exception("AI returned empty response");

                var result = JsonSerializer.Deserialize<AiEvaluationResponse>(generatedText);

                if (result == null)
                    throw new Exception("AI response parsing failed");

                return result;
            }
            catch
            {
                return GetFallbackResponse();
            }
        }

        private async Task<string> CallAiModel(string prompt)
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.HuggingFaceKey);

            var requestBody = new
            {
                inputs = prompt
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(
                "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
                content
            );

            if (!response.IsSuccessStatusCode)
                throw new Exception("AI API call failed");

            return await response.Content.ReadAsStringAsync();
        }

        private AiEvaluationResponse GetFallbackResponse()
        {
            return new AiEvaluationResponse
            {
                Skills = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nPlease retry the analysis\nModel formatting issue\nTry again later"
                },
                TechStack = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nPlease retry the analysis\nModel formatting issue\nTry again later"
                },
                Projects = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nPlease retry the analysis\nModel formatting issue\nTry again later"
                },
                Experience = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nPlease retry the analysis\nModel formatting issue\nTry again later"
                },
                Overall = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nPlease retry the analysis\nModel formatting issue\nTry again later"
                }
            };
        }
    }

    public class HuggingFaceResponse
    {
        public string generated_text { get; set; }
    }
}