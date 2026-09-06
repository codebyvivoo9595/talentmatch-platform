using Microsoft.EntityFrameworkCore;
using TalentMatch.Api.Data;
using TalentMatch.Api.Domain.Entities;

namespace TalentMatch.Api.Services
{
    /// <summary>
    /// Manages guest user creation, usage tracking, and limit enforcement.
    /// Guests get 5 free analyses per email address.
    /// </summary>
    public class GuestUsageService
    {
        public const int MaxGuestUses = 5;
        private readonly ApplicationDbContext _db;
        private readonly ILogger<GuestUsageService> _logger;

        public GuestUsageService(ApplicationDbContext db, ILogger<GuestUsageService> logger)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>
        /// Returns the current guest record for the email, or null if not found.
        /// </summary>
        public async Task<GuestUser?> GetGuestAsync(string email)
        {
            return await _db.GuestUsers
                .FirstOrDefaultAsync(g => g.Email == email.ToLowerInvariant());
        }

        /// <summary>
        /// Returns how many uses remain for this guest email.
        /// Creates the record if it doesn't exist yet.
        /// </summary>
        public async Task<GuestUsageStatus> GetStatusAsync(string email)
        {
            var normalizedEmail = email.ToLowerInvariant();
            var guest = await GetGuestAsync(normalizedEmail);

            if (guest == null)
            {
                // First time — create record
                guest = new GuestUser
                {
                    Email = normalizedEmail,
                    UsageCount = 0
                };
                _db.GuestUsers.Add(guest);
                await _db.SaveChangesAsync();
                _logger.LogInformation("New guest registered: {Email}", normalizedEmail);
            }

            var remaining = MaxGuestUses - guest.UsageCount;

            return new GuestUsageStatus
            {
                UsageCount = guest.UsageCount,
                RemainingUses = remaining,
                IsLimitReached = remaining <= 0,
                IsLastUse = remaining == 1,
                IsWarning = remaining == 2  // warn one step before last
            };
        }

        /// <summary>
        /// Increments the usage count for this guest email after a successful analysis.
        /// </summary>
        public async Task IncrementUsageAsync(string email)
        {
            var normalizedEmail = email.ToLowerInvariant();
            var guest = await GetGuestAsync(normalizedEmail);

            if (guest == null)
            {
                _logger.LogWarning("Attempted to increment usage for unknown guest: {Email}", normalizedEmail);
                return;
            }

            guest.UsageCount++;
            guest.LastUsedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _logger.LogInformation(
                "Guest {Email} used analysis. Count: {Count}/{Max}",
                normalizedEmail, guest.UsageCount, MaxGuestUses);
        }
    }

    public class GuestUsageStatus
    {
        public int UsageCount { get; set; }
        public int RemainingUses { get; set; }
        public bool IsLimitReached { get; set; }
        /// <summary>This is the last free use — show signup prompt after result.</summary>
        public bool IsLastUse { get; set; }
        /// <summary>One use before last — warn the user.</summary>
        public bool IsWarning { get; set; }
    }
}
