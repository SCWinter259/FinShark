using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("PortfolioItems")]
public class PortfolioItem
{
    // Table-specific properties
    public int Id { get; set; }
    public required string AppUserId { get; set; }
    public required AppUser AppUser { get; set; }

    // the number of shares that a user has in their portfolio (accommodated fractional trading)
    public required decimal Count { get; set; } 

    // Item properties
    [MaxLength(10)] public string Exchange { get; set; } = string.Empty;

    [MaxLength(10)] public string Symbol { get; set; } = string.Empty;

    [MaxLength(100)] public string Name { get; set; } = string.Empty;

    [MaxLength(10)] public string Type { get; set; } = string.Empty; // we set a standard on the front-end, I guess

    [Column(TypeName = "decimal(18,2)")] public decimal AveragePrice { get; set; }
}