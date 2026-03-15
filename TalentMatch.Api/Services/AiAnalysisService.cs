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

            var prompt = BuildPrompt(resumeText, jobDescription);

            var aiContent = await CallAiModel(prompt);

            try
            {
                var cleanedJson = ExtractJson(aiContent);

                var result = JsonSerializer.Deserialize<AiEvaluationResponse>(
                    cleanedJson,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                if (result == null)
                    throw new Exception("AI parsing failed");

                return result;
            }
            catch
            {
                return GetFallbackResponse();
            }
        }

        private string BuildPrompt(string resumeText, string jobDescription)
        {
            return $@"

You are an experienced technical recruiter reviewing a candidate's resume.

Evaluate how well the resume matches the job description.

--------------------------------
SCORING RULES
--------------------------------
Score each category from 0 to 5.

0 = No match
1 = Very weak
2 = Weak
3 = Moderate
4 = Strong
5 = Perfect

--------------------------------
CATEGORIES
--------------------------------
1. Skills
2. Tech Stack
3. Projects
4. Experience
5. Overall Fit

--------------------------------
OUTPUT RULES
--------------------------------
Return ONLY JSON.
Each reason must contain EXACTLY 4 lines separated by \n.

JSON FORMAT

{{
 ""skills"": {{ ""score"": number, ""reason"": ""line1\nline2\nline3\nline4"" }},
 ""techStack"": {{ ""score"": number, ""reason"": ""line1\nline2\nline3\nline4"" }},
 ""projects"": {{ ""score"": number, ""reason"": ""line1\nline2\nline3\nline4"" }},
 ""experience"": {{ ""score"": number, ""reason"": ""line1\nline2\nline3\nline4"" }},
 ""overall"": {{ ""score"": number, ""reason"": ""line1\nline2\nline3\nline4"" }}
}}

Resume:
{resumeText}

Job Description:
{jobDescription}
";
        }

        private async Task<string> CallAiModel(string prompt)
        {
            var requestBody = new
            {
                model = _settings.Model,
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                temperature = 0.2
            };

            var request = new HttpRequestMessage(HttpMethod.Post, _settings.Endpoint);

            request.Headers.Authorization =
                new AuthenticationHeaderValue("Bearer", _settings.ApiKey);

            request.Headers.Add("HTTP-Referer", "http://localhost");
            request.Headers.Add("X-Title", "TalentMatchAI");

            request.Content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
                throw new Exception("AI API call failed");

            var raw = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(raw);

            var content =
                doc.RootElement
                   .GetProperty("choices")[0]
                   .GetProperty("message")
                   .GetProperty("content")
                   .GetString();

            return content ?? "";
        }

        private string ExtractJson(string text)
        {
            var start = text.IndexOf('{');
            var end = text.LastIndexOf('}');

            if (start == -1 || end == -1)
                throw new Exception("JSON not found in AI response");

            return text.Substring(start, end - start + 1);
        }

        private AiEvaluationResponse GetFallbackResponse()
        {
            return new AiEvaluationResponse
            {
                Skills = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nParsing failed\nTry running analysis again\nCheck resume formatting"
                },
                TechStack = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nParsing failed\nTry running analysis again\nCheck resume formatting"
                },
                Projects = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nParsing failed\nTry running analysis again\nCheck resume formatting"
                },
                Experience = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nParsing failed\nTry running analysis again\nCheck resume formatting"
                },
                Overall = new ScoreDetail
                {
                    Score = 0,
                    Reason = "AI response invalid\nParsing failed\nTry running analysis again\nCheck resume formatting"
                }
            };
        }
    }
}