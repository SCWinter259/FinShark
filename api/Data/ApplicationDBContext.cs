using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

/*
 * The context actually goes into the database and search the tables for you.
 */
public class ApplicationDBContext(DbContextOptions dbContextOptions) : IdentityDbContext<AppUser>(dbContextOptions)
{
    public DbSet<PortfolioItem> PortfolioItems { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // declare (composite) foreign key for PortfolioItem
        // each app user has many portfolio items
        builder.Entity<PortfolioItem>().HasOne(u => u.AppUser).WithMany(u => u.PortfolioItems)
            .HasForeignKey(p => p.AppUserId);

        /*
         * At least 1 user role is required in .NET
         * we have 2 roles here, basically superuser and normal user
         */
        // In .NET 9.0, explicit Id must be added, because it won't except the
        // db context changing everytime it is built
        List<IdentityRole> roles =
        [
            new IdentityRole
            {
                Id = "Admin",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },

            new IdentityRole
            {
                Id = "User",
                Name = "User",
                NormalizedName = "USER"
            }
        ];
        builder.Entity<IdentityRole>().HasData(roles);
    }
}