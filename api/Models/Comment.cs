using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("Comments")]
public class Comment
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.Now;
    // this will allow us to map comments on stocks
    public int? StockId { get; set; }
    
    // this is a navigation property. Later on when
    // we use this model we can call the Stock object
    // and do stuff. Pretty handy.
    public Stock? Stock { get; set; }
    public string AppUserId { get; set; }
    public AppUser AppUser { get; set; }
}