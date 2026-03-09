using Microsoft.EntityFrameworkCore;
using TalentMatch.Api.Domain.Entities;
using User = TalentMatch.Api.Domain.Entities.User;

namespace TalentMatch.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        public DbSet<AnalysisResult> AnalysisResults => Set<AnalysisResult>();
    }
}