using System.ComponentModel.DataAnnotations;

namespace TalentMatch.Api.Models
{
    public class GuestAnalyzeRequest
    {
        [Required]
        [EmailAddress]
        public string GuestEmail { get; set; } = string.Empty;

        [Required]
        public IFormFile Resume { get; set; } = null!;

        [Required]
        public string JobDescription { get; set; } = string.Empty;
    }
}
