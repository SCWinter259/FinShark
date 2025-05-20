using api.Extensions;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;

namespace api.Controllers;

[Route("api/portfolio")]
[ApiController]
public class PortfolioController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IStockRepository _stockRepo;
    private readonly IPortfolioRepository _portfolioRepo;
    private readonly IFMPService _fmpService;

    public PortfolioController(UserManager<AppUser> userManager, IStockRepository stockRepo,
        IPortfolioRepository portfolioRepo, IFMPService fmpService)
    {
        _userManager = userManager;
        _stockRepo = stockRepo;
        _portfolioRepo = portfolioRepo;
        _fmpService = fmpService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserPortfolio()
    {
        var username = User.GetUsername();
        var appUser = await _userManager.FindByNameAsync(username);
        // suppress warning because only authenticated users can use this method, which
        // means the user exists
        var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser!);
        return Ok(userPortfolio);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddPortfolio(string symbol)
    {
        var username = User.GetUsername();
        var appUser = await _userManager.FindByNameAsync(username);
        var stock = await _stockRepo.GetBySymbolAsync(symbol);
        
        if (stock == null)
        {
            stock = await _fmpService.FindStockBySymbolAsync(symbol);
            if (stock == null)
            {
                return BadRequest("Stock not found");
            }

            await _stockRepo.CreateAsync(stock);
        }

        if (stock == null) return BadRequest("Stock not found");
        // suppress warning because the user has to be authenticated to get here
        var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser!);

        // check if the relationship between user and stock existed
        if (userPortfolio.Any(e => e.Symbol.ToLower() == symbol.ToLower()))
        {
            return BadRequest("Cannot add same stock to portfolio");
        }

        // if not, create the relationship
        var portfolioModel = new Portfolio
        {
            StockId = stock.Id,
            AppUserId = appUser!.Id,
        };

        await _portfolioRepo.CreateAsync(portfolioModel);

        return Created();
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> DeletePortfolio(string symbol)
    {
        var username = User.GetUsername();
        var appUser = await _userManager.FindByNameAsync(username);
        // suppress warning because the user has to be authenticated to get here
        var userPortfolio = await _portfolioRepo.GetUserPortfolio(appUser!);

        var filteredStock = userPortfolio.Where(s => s.Symbol.ToLower() == symbol.ToLower()).ToList();

        if (filteredStock.Count == 1)
        {
            await _portfolioRepo.DeletePortfolio(appUser!, symbol);
        }
        else
        {
            return BadRequest("Stock is not in your portfolio");
        }

        return Ok();
    }
}