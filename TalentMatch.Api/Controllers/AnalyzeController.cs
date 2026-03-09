using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalentMatch.Api.Services;
using TalentMatch.Api.Domain.Entities;
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
        private readonly ScoreCalculationService _scoreService;
        private readonly ApplicationDbContext _context;

        public AnalyzeController(
            ResumeParserService resumeParser,
            AiAnalysisService aiService,
            ScoreCalculationService scoreService,
            ApplicationDbContext context)
        {
            _resumeParser = resumeParser;
            _aiService = aiService;
            _scoreService = scoreService;
            _context = context;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Analyze(
            [FromForm] IFormFile resume,
            [FromForm] string jobDescription)
        {
            try
            {
                if (resume == null || resume.Length == 0)
                    return BadRequest("Resume file required");

                if (string.IsNullOrWhiteSpace(jobDescription))
                    return BadRequest("Job description required");

                // Extract Resume Text using ResumeParserService. This service uses a PDF parsing library to read the uploaded resume file and extract its text content for analysis by the AI service.
                string resumeText;

                using (var stream = resume.OpenReadStream())
                {
                    resumeText = _resumeParser.ExtractTextFromPdf(stream);
                }

                // Call AI Service to analyze resume against job description and get scores
                var aiResponse = await _aiService.AnalyzeAsync(resumeText, jobDescription);

                if (aiResponse == null)
                    return StatusCode(500, "AI analysis failed");

                // Calculate Score Percentages based on AI response using ScoreCalculationService. This service takes the raw scores from the AI response and converts them into percentage values for easier interpretation and comparison.
                var finalPercentage = _scoreService.Calculate(aiResponse);

                // Get UserId from JWT claims to associate analysis result with user. This assumes the user is authenticated and the token contains the NameIdentifier claim with the user's ID.
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userIdClaim == null)
                    return Unauthorized();

                var userId = Guid.Parse(userIdClaim);

                // Save Result to Database
                var result = new AnalysisResult
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    SkillsScore = aiResponse.Skills.Score,
                    TechStackScore = aiResponse.TechStack.Score,
                    ProjectsScore = aiResponse.Projects.Score,
                    ExperienceScore = aiResponse.Experience.Score,
                    OverallScore = aiResponse.Overall.Score,
                    FinalPercentage = finalPercentage,
                    AiResponse = JsonSerializer.Serialize(aiResponse)
                };

                _context.AnalysisResults.Add(result);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    result.Id,
                    result.FinalPercentage,
                    aiResponse
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}