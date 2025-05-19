using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("Stocks")]
public class Stock
{
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    // we need to ensure that the number we are getting is a monetary value
    // in this case, the limit is 18 decimals, and 2 point decimals
    [Column(TypeName = "decimal(18,2)")]
    public decimal Purchase { get; set; }
    [Column(TypeName = "decimal(18,2)")]
    public decimal LastDiv { get; set; }
    public string Industry { get; set; } = string.Empty;
    public long MarketCap { get; set; }     // market cap can be in the trillions -> long int
    public List<Comment> Comments { get; set; } = new List<Comment>();  // property is init only
    public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
}