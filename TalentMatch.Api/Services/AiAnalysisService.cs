using System.Net.Http.Headers;
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
Resume:
{resumeText}

Job Description:
{jobDescription}

Evaluate resume against job description and return JSON with scores.";

            //var requestBody = new
            //{
            //    inputs = prompt
            //};

            //var content = new StringContent(
            //    System.Text.Json.JsonSerializer.Serialize(requestBody),
            //    Encoding.UTF8,
            //    "application/json"
            //);

            //var response = await _httpClient.PostAsync(
            //    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            //    content
            //);



            //return await response.Content.ReadAsStringAsync();


            var aiRawResponse = await CallAiModel(prompt);

            var result = JsonSerializer.Deserialize<AiEvaluationResponse>(aiRawResponse);

            return result;
        }


    }
}





