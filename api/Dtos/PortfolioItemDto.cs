using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Dtos;

public class PortfolioItemDto
{
    // the number of shares that a user has in their portfolio (accommodated fractional trading)
    public required decimal Count { get; set; } 

    // // Item properties
    [MaxLength(10)] public string Exchange { get; set; } = string.Empty;

    [MaxLength(10)] public string Symbol { get; set; } = string.Empty;

    [MaxLength(100)] public string Name { get; set; } = string.Empty;

    [MaxLength(10)] [RegularExpression("^(Stock|ETF|Crypto)$", ErrorMessage = "Type must be 'Stock', 'ETF', or 'Crypto'.")] 
    public string Type { get; set; } = string.Empty; // we set a standard on the front-end, I guess

    [Column(TypeName = "decimal(18,2)")] public decimal AveragePrice { get; set; }
}