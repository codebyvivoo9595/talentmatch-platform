using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
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

        public DbSet<GuestUser> GuestUsers => Set<GuestUser>();

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Suppress the PendingModelChangesWarning — snapshot is intentionally
            // managed manually (no dotnet ef add migration commands on office laptop).
            optionsBuilder.ConfigureWarnings(w =>
                w.Ignore(RelationalEventId.PendingModelChangesWarning));
        }
    }
}