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
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserPortfolioItems()
    {
        try
        {
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
    public async Task<IActionResult> CreatePortfolioItem(PortfolioItem portfolioItem)
    {
        throw new NotImplementedException();
    }
}