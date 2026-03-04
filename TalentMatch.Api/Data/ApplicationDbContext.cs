using Microsoft.EntityFrameworkCore;
using TalentMatch.Api.Models;

namespace TalentMatch.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
    }
}