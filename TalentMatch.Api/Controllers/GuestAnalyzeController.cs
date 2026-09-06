using Microsoft.AspNetCore.Mvc;
using TalentMatch.Api.Models;
using TalentMatch.Api.Services;

namespace TalentMatch.Api.Controllers
{
    /// <summary>
    /// Guest analysis endpoint — no JWT required.
    /// Guests are limited to 5 free analyses per email address.
    /// Rate limited to 10 requests per IP per hour (configured in appsettings.json).
    /// </summary>
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class GuestAnalyzeController : ControllerBase
    {
        private readonly ResumeParserService _resumeParser;
        private readonly AiAnalysisService _aiService;
        private readonly ScoreCalculationService _scoreService;
        private readonly SuggestionService _suggestionService;
        private readonly GuestUsageService _guestUsage;
        private readonly InputSanitizationService _sanitizer;
        private readonly ILogger<GuestAnalyzeController> _logger;

        public GuestAnalyzeController(
            ResumeParserService resumeParser,
            AiAnalysisService aiService,
            ScoreCalculationService scoreService,
            SuggestionService suggestionService,
            GuestUsageService guestUsage,
            InputSanitizationService sanitizer,
            ILogger<GuestAnalyzeController> logger)
        {
            _resumeParser = resumeParser;
            _aiService = aiService;
            _scoreService = scoreService;
            _suggestionService = suggestionService;
            _guestUsage = guestUsage;
            _sanitizer = sanitizer;
            _logger = logger;
        }

        /// <summary>
        /// Analyzes a resume against a job description for a guest user.
        /// Requires only an email address (no account needed).
        /// Limited to 5 analyses per email.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> GuestAnalyze([FromForm] GuestAnalyzeRequest request)
        {
            try
            {
                // ── 1. Validate and sanitize email ────────────────────────────
                var emailResult = _sanitizer.SanitizeEmail(request.GuestEmail);
                if (!emailResult.IsValid)
                    return BadRequest(emailResult.ErrorMessage);

                var email = emailResult.SanitizedValue;

                // ── 2. Check guest usage limit ────────────────────────────────
                var status = await _guestUsage.GetStatusAsync(email);

                if (status.IsLimitReached)
                {
                    _logger.LogWarning("Guest limit reached for: {Email}", email);
                    return StatusCode(429, new
                    {
                        error = "limit_reached",
                        message = "You have used all 5 free analyses. Please create an account to continue.",
                        usageCount = status.UsageCount,
                        remainingUses = 0
                    });
                }

                // ── 3. Validate resume file ───────────────────────────────────
                if (request.Resume == null || request.Resume.Length == 0)
                    return BadRequest("Resume file is required.");

                if (!request.Resume.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                    return BadRequest("Only PDF resumes are supported.");

                if (request.Resume.Length > 5 * 1024 * 1024)
                    return BadRequest("Resume file must be under 5MB.");

                // ── 4. Validate and sanitize job description ──────────────────
                var jdResult = _sanitizer.SanitizeJobDescription(request.JobDescription);
                if (!jdResult.IsValid)
                {
                    _logger.LogWarning("Guest JD sanitization failed for {Email}: {Error}", email, jdResult.ErrorMessage);
                    return BadRequest(jdResult.ErrorMessage);
                }

                // ── 5. Extract resume text ────────────────────────────────────
                string resumeText;
                using (var stream = request.Resume.OpenReadStream())
                {
                    resumeText = _resumeParser.ExtractTextFromPdf(stream);
                }

                // ── 6. Run AI analysis ────────────────────────────────────────
                var aiResponse = await _aiService.AnalyzeAsync(resumeText, jdResult.SanitizedValue);

                if (aiResponse == null)
                    return StatusCode(500, "AI analysis failed.");

                var finalPercentage = _scoreService.Calculate(aiResponse);
                var suggestions = _suggestionService.ExtractSuggestions(aiResponse);
                var missingSkills = aiResponse.MissingSkills ?? new List<string>();

                // ── 7. Increment usage AFTER successful analysis ──────────────
                await _guestUsage.IncrementUsageAsync(email);
                var updatedStatus = await _guestUsage.GetStatusAsync(email);

                _logger.LogInformation(
                    "Guest analysis completed for {Email}. Uses: {Count}/{Max}",
                    email, updatedStatus.UsageCount, GuestUsageService.MaxGuestUses);

                // ── 8. Return result with usage info ─────────────────────────
                return Ok(new
                {
                    finalPercentage,
                    aiResponse,
                    suggestions,
                    missingSkills,
                    guestUsage = new
                    {
                        usageCount = updatedStatus.UsageCount,
                        remainingUses = updatedStatus.RemainingUses,
                        isLastUse = updatedStatus.IsLastUse,
                        isWarning = updatedStatus.IsWarning,
                        isLimitReached = updatedStatus.IsLimitReached,
                        message = updatedStatus.IsLastUse
                            ? "This was your last free analysis. Create an account to continue using TalentMatch."
                            : updatedStatus.IsWarning
                                ? $"You have {updatedStatus.RemainingUses} free analyses remaining. Create an account to get unlimited access."
                                : $"{updatedStatus.RemainingUses} free analyses remaining."
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Guest analysis failed for {Email}", request.GuestEmail);
                return StatusCode(500, ex.Message);
            }
        }

        /// <summary>
        /// Returns the current usage status for a guest email without consuming a use.
        /// Used by the frontend to show the usage indicator before analysis.
        /// </summary>
        [HttpGet("status")]
        public async Task<IActionResult> GetGuestStatus([FromQuery] string email)
        {
            var emailResult = _sanitizer.SanitizeEmail(email);
            if (!emailResult.IsValid)
                return BadRequest(emailResult.ErrorMessage);

            var status = await _guestUsage.GetStatusAsync(emailResult.SanitizedValue);

            return Ok(new
            {
                usageCount = status.UsageCount,
                remainingUses = status.RemainingUses,
                isLimitReached = status.IsLimitReached,
                maxUses = GuestUsageService.MaxGuestUses,
                message = status.IsLimitReached
                    ? "You have used all 5 free analyses. Please create an account to continue."
                    : $"You have {status.RemainingUses} of {GuestUsageService.MaxGuestUses} free analyses remaining."
            });
        }
    }
}
