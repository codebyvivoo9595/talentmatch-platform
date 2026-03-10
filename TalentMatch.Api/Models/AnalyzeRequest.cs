using System.ComponentModel.DataAnnotations;

namespace TalentMatch.Api.Models
{
    public class AnalyzeRequest
    {
            [Required]
            public IFormFile Resume { get; set; }
            [Required]
            public string JobDescription { get; set; }
        
    }
}
