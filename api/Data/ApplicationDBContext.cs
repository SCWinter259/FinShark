using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

/*
 * The context actually goes into the database and search the tables for you.
 */
public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
    {
    }

    public DbSet<Stock> Stocks { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Portfolio> Portfolios { get; set; }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // declare foreign keys for Portfolio
        builder.Entity<Portfolio>(x => x.HasKey(p => new { p.AppUserId, p.StockId }));
        // a portfolio points to a single app user, an app user can point to many portfolios, portfolio table will use AppUserId for this relationship
        builder.Entity<Portfolio>().HasOne(u => u.AppUser).WithMany(u => u.Portfolios).HasForeignKey(p => p.AppUserId);
        builder.Entity<Portfolio>().HasOne(u => u.Stock).WithMany(u => u.Portfolios).HasForeignKey(p => p.StockId);

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