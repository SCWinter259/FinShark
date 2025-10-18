using System.ComponentModel.DataAnnotations;

namespace api.Dtos;

public class PortfolioItemDto
{
    [Required, MaxLength(10)]
    public required string Exchange { get; set; }
}