using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

/*
 * The context actually goes into the database and search the tables for you.
 */
public class ApplicationDBContext : DbContext
{
    public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions) {}
    
    public DbSet<Stock> Stock {  get; set; }
    public DbSet<Comment> Comments {  get; set; }
}