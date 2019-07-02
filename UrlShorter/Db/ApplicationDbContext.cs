using Microsoft.EntityFrameworkCore;

namespace UrlShorter.Db
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<UrlMap>UrlMaps { get; set; }
    }
}