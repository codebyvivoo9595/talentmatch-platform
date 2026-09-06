using System.ComponentModel.DataAnnotations;

namespace TalentMatch.Api.Domain.Entities
{
    public class GuestUser
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// How many times this guest email has run an analysis. Max = 5.
        /// </summary>
        public int UsageCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastUsedAt { get; set; } = DateTime.UtcNow;
    }
}
