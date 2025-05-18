using api.Dtos.Comment;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/comment")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly ICommentRepository _commentRepo;
    private readonly IStockRepository _stockRepo;

    public CommentController(ICommentRepository commentRepo, IStockRepository stockRepo)
    {
        _commentRepo = commentRepo;
        _stockRepo = stockRepo;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var comments = await _commentRepo.GetAllAsync();
        var commentDtos = comments.Select(s => s.ToCommentDto());
        return Ok(commentDtos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var comment = await _commentRepo.GetByIdAsync(id);

        if (comment == null)
        {
            return NotFound();
        }
        
        return Ok(comment.ToCommentDto());
    }

    /*
     * As one might notice, the is no [FromBody] for commentDto
     *
     * Explain:
     * The default behavior is:
       
       If the parameter is a primitive type (int, bool, double, ...), Web API tries to get the value from the URI of the HTTP request.
       
       For complex types (your own object, for example: Person), Web API tries to read the value from the body of the HTTP request.
       
       So, if you have:
       
       a primitive type in the URI, or
       a complex type in the body
       ...then you don't have to add any attributes (neither [FromBody] nor [FromUri]).
     */
    [HttpPost("{stockId:int}")]
    public async Task<IActionResult> Create([FromRoute] int stockId, CreateCommentDto commentDto)
    {
        // ModelState inherited from ControllerBase
        // it checks the integrity of the DTO
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        if (!await _stockRepo.StockExists(stockId))
        {
            return BadRequest("Stock does not exist");
        }

        var commentModel = commentDto.ToCommentFromCreate(stockId);
        await _commentRepo.CreateAsync(commentModel);
        
        return CreatedAtAction(nameof(GetById), new { id = commentModel.Id }, commentModel.ToCommentDto());
    }

    [HttpPut]
    [Route("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateCommentRequestDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var comment = await _commentRepo.UpdateAsync(id, updateDto.ToCommentFromUpdate());

        if (comment == null)
        {
            return NotFound("Comment not found");
        }
        
        return Ok(comment.ToCommentDto());
    }

    [HttpDelete]
    [Route("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var commentModel = await _commentRepo.DeleteAsync(id);

        if (commentModel == null)
        {
            return NotFound("Comment does not exist");
        }
        
        return Ok(commentModel);
    }
}