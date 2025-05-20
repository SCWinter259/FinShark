using api.Dtos.Comment;
using api.Extensions;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/comment")]
[ApiController]
public class CommentController : ControllerBase
{
    private readonly ICommentRepository _commentRepo;
    private readonly IStockRepository _stockRepo;
    private readonly UserManager<AppUser> _userManager;
    private readonly IFMPService _fmpService;

    public CommentController(ICommentRepository commentRepo, IStockRepository stockRepo,
        UserManager<AppUser> userManager, IFMPService fmpService)
    {
        _commentRepo = commentRepo;
        _stockRepo = stockRepo;
        _userManager = userManager;
        _fmpService = fmpService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] CommentQueryObject queryObject)
    {
        var comments = await _commentRepo.GetAllAsync(queryObject);
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
    [HttpPost]
    [Route("{symbol:alpha}")]
    [Authorize]
    public async Task<IActionResult> Create([FromRoute] string symbol, CreateCommentDto commentDto)
    {
        // ModelState inherited from ControllerBase
        // it checks the integrity of the DTO
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // try to find the stock in the database first
        var stock = await _stockRepo.GetBySymbolAsync(symbol);

        // if it is not in our db, we go online
        if (stock == null)
        {
            stock = await _fmpService.FindStockBySymbolAsync(symbol);
            if (stock == null)
            {
                return BadRequest("Stock not found");
            }

            await _stockRepo.CreateAsync(stock);
        }

        if (!await _stockRepo.StockExists(stock.Id))
        {
            return BadRequest("Stock does not exist");
        }

        var username = User.GetUsername();
        var appUser = await _userManager.FindByNameAsync(username);

        var commentModel = commentDto.ToCommentFromCreate(stock.Id);
        // suppress because the user has to be authorized already
        commentModel.AppUserId = appUser!.Id;
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