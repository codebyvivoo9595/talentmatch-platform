
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentMatch.Api.Services;
using TalentMatch.Api.Models;
using TalentMatch.Api.Domain.Entities;
using TalentMatch.Api.Infrastructure;
using System.Security.Claims;
using System.Text.Json;
using TalentMatch.Api.Data;

namespace TalentMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly ResumeParserService _resumeParser;
        private readonly AiAnalysisService _aiService;
        private readonly ApplicationDbContext _context;
        private readonly AiEvaluationResponse _aiResponse;

        public AnalyzeController(
            ResumeParserService resumeParser,
            AiAnalysisService aiService,
            ApplicationDbContext context,
            AiEvaluationResponse aiResponse)
        {
            _resumeParser = resumeParser;
            _aiService = aiService;
            _context = context;
            _aiResponse = aiResponse;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Analyze(
            IFormFile resume,
            [FromForm] string jobDescription)
        {
            if (resume == null || resume.Length == 0)
                return BadRequest("Resume file required");

            if (string.IsNullOrWhiteSpace(jobDescription))
                return BadRequest("Job description required");

            // 1️⃣ Extract Resume Text
            string resumeText;

            using (var stream = resume.OpenReadStream())
            {
                resumeText = _resumeParser.ExtractTextFromPdf(stream);
            }

            // 2️⃣ Call AI Service
            var aiResponse = await _aiService.AnalyzeAsync(resumeText, jobDescription);

            // 3️⃣ Calculate Weighted Score
            double finalPercentage =
                (aiResponse.skills.score / 5.0) * 30 +
                (aiResponse.techStack.score / 5.0) * 30 +
                (aiResponse.projects.score / 5.0) * 20 +
                (aiResponse.experience.score / 5.0) * 10 +
                (aiResponse.overall.score / 5.0) * 10;

            // 4️⃣ Get UserId from JWT
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            // 5️⃣ Save Result
            var result = new AnalysisResult
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                SkillsScore = aiResponse.skills.score,
                TechStackScore = aiResponse.techStack.score,
                ProjectsScore = aiResponse.projects.score,
                ExperienceScore = aiResponse.experience.score,
                OverallScore = aiResponse.overall.score,
                FinalPercentage = finalPercentage,
                AiResponse = JsonSerializer.Serialize(aiResponse)
            };

            _context.AnalysisResults.Add(result);
            await _context.SaveChangesAsync();

            // 6️⃣ Return response
            return Ok(new
            {
                result.Id,
                result.FinalPercentage,
                aiResponse
            });
        }
    }
}