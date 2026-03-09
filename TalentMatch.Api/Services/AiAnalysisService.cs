using System.Text;
using System.Text.Json;
using TalentMatch.Api.Models;

namespace TalentMatch.Api.Services
{
    public class AiAnalysisService
    {
        private readonly HttpClient _httpClient;

        public AiAnalysisService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AiEvaluationResponse> AnalyzeAsync(string resumeText, string jobDescription)
        {
            var prompt = $@"
You are a resume evaluator.

Compare the resume with the job description.

Return STRICT JSON only in this format:

{{
  ""skills"": {{ ""score"": 0-5, ""reason"": ""text"" }},
  ""techStack"": {{ ""score"": 0-5, ""reason"": ""text"" }},
  ""projects"": {{ ""score"": 0-5, ""reason"": ""text"" }},
  ""experience"": {{ ""score"": 0-5, ""reason"": ""text"" }},
  ""overall"": {{ ""score"": 0-5, ""reason"": ""text"" }}
}}

Resume:
{resumeText}

Job Description:
{jobDescription}
";

            var aiRawResponse = await CallAiModel(prompt);

            var result = JsonSerializer.Deserialize<AiEvaluationResponse>(aiRawResponse);

            if (result == null)
                throw new Exception("AI response parsing failed");

            return result;
        }

        private async Task<string> CallAiModel(string prompt)
        {
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

            var raw = await response.Content.ReadAsStringAsync();

            return raw;
        }
    }
}