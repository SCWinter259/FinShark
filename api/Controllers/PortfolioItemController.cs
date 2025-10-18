using api.Dtos;
using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/portfolio")]
[ApiController]
public class PortfolioItemController(UserManager<AppUser> userManager, IPortfolioItemRepository portfolioItemRepo)
    : ControllerBase
{
    /// <summary>
    /// Get all PortfolioItems of the current user
    /// </summary>
    /// <returns>200 and the list of items if success, otherwise 500</returns>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserPortfolioItems()
    {
        try
        {
            // check user existence
            var username = User.GetUsername();
            var appUser = await userManager.FindByNameAsync(username);

            if (appUser == null)
            {
                return NotFound(new {message = "User not found"});
            }
        
            var userPortfolioItems = await portfolioItemRepo.GetUserPortfolioItems(appUser);
            return Ok(userPortfolioItems);
        }
        catch(Exception ex)
        {
            return StatusCode(500, new {message = "An unexpected error occured", details = ex.Message});
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreatePortfolioItem([FromBody] PortfolioItemDto portfolioItemDto)
    {
        try
        {
            // check user existence
            var username = User.GetUsername();
            var appUser = await userManager.FindByNameAsync(username);

            if (appUser == null)
            {
                return NotFound(new {message = "User not found"});
            }
            
            // check model state of request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // create the PortfolioItem to feed the database
            var newPortfolioItem = new PortfolioItem
            {
                AppUserId = appUser.Id,
                AppUser = appUser,
                Count = portfolioItemDto.Count,
                AveragePrice = portfolioItemDto.AveragePrice,
                Type = portfolioItemDto.Type,
                Exchange = portfolioItemDto.Exchange,
                Name = portfolioItemDto.Name,
                Symbol = portfolioItemDto.Symbol,
            };
            
            await portfolioItemRepo.AddPortfolioItem(newPortfolioItem);

            return Ok(newPortfolioItem);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new {message = "An unexpected error occured", details = ex.Message});
        }
    }
}