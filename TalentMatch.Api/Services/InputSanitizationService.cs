using System.Text.RegularExpressions;

namespace TalentMatch.Api.Services
{
    /// <summary>
    /// Sanitizes and validates user-supplied text inputs.
    /// Blocks HTML injection, prompt injection, and malicious patterns
    /// before the content reaches the AI model or the database.
    /// </summary>
    public class InputSanitizationService
    {
        private const int MaxJobDescriptionLength = 3000;
        private const int MaxEmailLength = 256;
        private const int MinJobDescriptionLength = 100;

        // ── Patterns that indicate prompt injection attempts ──────────────────
        private static readonly string[] PromptInjectionPatterns =
        {
            @"ignore previous instructions",
            @"ignore all instructions",
            @"forget previous",
            @"you are now",
            @"act as",
            @"disregard",
            @"\[INST\]",
            @"<<SYS>>",
            @"<</SYS>>",
            @"system:",
            @"###\s*instruction",
            @"###\s*system",
            @"###\s*prompt",
            @"jailbreak",
            @"dan mode",
            @"developer mode",
        };

        // ── Patterns that indicate HTML / script injection ────────────────────
        private static readonly string[] HtmlInjectionPatterns =
        {
            @"<script[^>]*>",
            @"</script>",
            @"<iframe[^>]*>",
            @"<img[^>]*onerror",
            @"javascript:",
            @"vbscript:",
            @"onload\s*=",
            @"onclick\s*=",
        };

        // ── Characters that are not expected in a genuine job description ─────
        private static readonly char[] DisallowedChars = { '<', '>', '`' };

        /// <summary>
        /// Validates and sanitizes a job description string.
        /// Returns a SanitizationResult indicating whether the input is safe.
        /// </summary>
        public SanitizationResult SanitizeJobDescription(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return SanitizationResult.Fail("Job description cannot be empty.");

            // Length checks
            if (input.Length < MinJobDescriptionLength)
                return SanitizationResult.Fail($"Job description must be at least {MinJobDescriptionLength} characters.");

            if (input.Length > MaxJobDescriptionLength)
                return SanitizationResult.Fail($"Job description cannot exceed {MaxJobDescriptionLength} characters.");

            // Disallowed characters
            foreach (var ch in DisallowedChars)
            {
                if (input.Contains(ch))
                    return SanitizationResult.Fail($"Job description contains disallowed character: '{ch}'.");
            }

            // HTML injection
            foreach (var pattern in HtmlInjectionPatterns)
            {
                if (Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase))
                    return SanitizationResult.Fail("Job description contains potentially malicious HTML content.");
            }

            // Prompt injection
            foreach (var pattern in PromptInjectionPatterns)
            {
                if (Regex.IsMatch(input, pattern, RegexOptions.IgnoreCase))
                    return SanitizationResult.Fail("Job description contains content that looks like an instruction injection attempt. Please paste a valid job description.");
            }

            // Repeated character abuse (e.g. "AAAAAAA..." > 50 times)
            if (Regex.IsMatch(input, @"(.)\1{50,}"))
                return SanitizationResult.Fail("Job description contains suspicious repeated characters.");

            // URLs — not expected in a real JD
            if (Regex.IsMatch(input, @"https?://[^\s]+", RegexOptions.IgnoreCase))
                return SanitizationResult.Fail("Job description should not contain URLs. Please paste only the job description text.");

            // Clean: strip double-quotes and single-quotes to prevent SQL/prompt issues
            var sanitized = input
                .Replace("\"", "")
                .Replace("'", "")
                .Trim();

            return SanitizationResult.Ok(sanitized);
        }

        /// <summary>
        /// Validates an email address format and length.
        /// </summary>
        public SanitizationResult SanitizeEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return SanitizationResult.Fail("Email cannot be empty.");

            if (email.Length > MaxEmailLength)
                return SanitizationResult.Fail("Email address is too long.");

            // Basic email format
            if (!Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                return SanitizationResult.Fail("Invalid email address format.");

            // No HTML or special chars in email
            foreach (var ch in DisallowedChars)
            {
                if (email.Contains(ch))
                    return SanitizationResult.Fail("Email contains disallowed characters.");
            }

            return SanitizationResult.Ok(email.Trim().ToLowerInvariant());
        }
    }

    public class SanitizationResult
    {
        public bool IsValid { get; private set; }
        public string SanitizedValue { get; private set; } = string.Empty;
        public string ErrorMessage { get; private set; } = string.Empty;

        public static SanitizationResult Ok(string value) =>
            new() { IsValid = true, SanitizedValue = value };

        public static SanitizationResult Fail(string error) =>
            new() { IsValid = false, ErrorMessage = error };
    }
}
