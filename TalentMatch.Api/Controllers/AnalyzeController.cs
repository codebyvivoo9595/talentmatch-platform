using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;
using TalentMatch.Api.Data;
using TalentMatch.Api.Domain.Entities;
using TalentMatch.Api.Models;
using TalentMatch.Api.Services;

namespace TalentMatch.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly ResumeParserService _resumeParser;
        private readonly AiAnalysisService _aiService;
        private readonly ScoreCalculationService _scoreService;
        private readonly SuggestionService _suggestionService;
        private readonly SkillGapService _skillGapService;
        private readonly ApplicationDbContext _context;

        public AnalyzeController(
            ResumeParserService resumeParser,
            AiAnalysisService aiService,
            ScoreCalculationService scoreService,
            SuggestionService suggestionService,
            SkillGapService skillGapService,
            ApplicationDbContext context)
        {
            _resumeParser = resumeParser;
            _aiService = aiService;
            _scoreService = scoreService;
            _suggestionService = suggestionService;
            _skillGapService = skillGapService;
            _context = context;
        }

        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> Analyze(
           [FromForm] AnalyzeRequest request)
        {
            try
            {
                if (request.Resume == null || request.Resume.Length == 0)
                    return BadRequest("Resume file required");

                if (!request.Resume.FileName.EndsWith(".pdf"))
                    return BadRequest("Only PDF resumes are supported");

                if (request.Resume.Length > 5 * 1024 * 1024)
                    return BadRequest("Resume file must be under 5MB");

                if (string.IsNullOrWhiteSpace(request.JobDescription))
                    return BadRequest("Job description required");

                // Extract Resume Text using ResumeParserService. This service uses a PDF parsing library to read the uploaded resume file and extract its text content for analysis by the AI service.
                string resumeText;

                using (var stream = request.Resume.OpenReadStream())
                {
                    resumeText = _resumeParser.ExtractTextFromPdf(stream);
                }

                // Call AI Service to analyze resume against job description and get scores
                var aiResponse = await _aiService.AnalyzeAsync(resumeText, request.JobDescription);

                // Extract Suggestions from AI response using SuggestionService. This service takes the raw scores and feedback from the AI response and generates actionable suggestions for the candidate to improve their resume and better match the job description.
                var suggestions = _suggestionService.ExtractSuggestions(aiResponse);

                // Detect Missing Skills using SkillGapService. This service compares the skills listed in the job description with those mentioned in the resume and identifies any gaps or missing skills that the candidate should consider adding to their resume or acquiring to better fit the job requirements.
                var missingSkills =
                _skillGapService.DetectMissingSkills(request.JobDescription, aiResponse);

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
                    aiResponse,
                    suggestions,
                    missingSkills
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}