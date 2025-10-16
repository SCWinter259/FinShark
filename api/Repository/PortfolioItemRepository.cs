using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class PortfolioItemRepository(ApplicationDBContext context) : IPortfolioItemRepository
{
    /// <summary>
    /// Get all items in a user's portfolio
    /// </summary>
    /// <param name="user">An AppUser object, representing the current user</param>
    /// <returns>A list of PortfolioItem</returns>
    public async Task<List<PortfolioItem>> GetUserPortfolioItems(AppUser user)
    {
        return await context.PortfolioItems.Where(u => u.AppUserId == user.Id).Select(item => new PortfolioItem
        {
            Id = item.Id,
            Count =  item.Count,
            Exchange = item.Exchange,
            Symbol = item.Symbol,
            Name = item.Name,
            Type = item.Type,
            AveragePrice = item.AveragePrice,
        }).ToListAsync();
    }

    /// <summary>
    /// Add a PortfolioItem for a user
    /// </summary>
    /// <param name="user">An AppUser object, representing the current user</param>
    /// <param name="portfolioItem">The added PortfolioItem</param>
    /// <returns></returns>
    public async Task<PortfolioItem?> AddPortfolioItem(AppUser user, PortfolioItem portfolioItem)
    {
        var existingPortfolioItem = await context.PortfolioItems.FirstOrDefaultAsync(item => 
            item.AppUserId == user.Id && 
            item.Symbol == portfolioItem.Symbol && 
            item.Exchange == portfolioItem.Exchange && 
            item.Name == portfolioItem.Name && 
            item.Type == portfolioItem.Type);
        
        // we reject the operation if the portfolio item already exists for the user
        if (existingPortfolioItem != null) return null;

        await context.PortfolioItems.AddAsync(portfolioItem);
        await context.SaveChangesAsync();
        return portfolioItem;
    }

    /// <summary>
    /// Update the Count and AveragePrice for an existing PortfolioItem
    /// </summary>
    /// <param name="user">An AppUser object, representing the current user</param>
    /// <param name="portfolioItem">The updated PortfolioItem</param>
    /// <returns></returns>
    public async Task<PortfolioItem?> UpdatePortfolioItem(AppUser user, PortfolioItem portfolioItem)
    {
        var existingPortfolioItem = await context.PortfolioItems.FirstOrDefaultAsync(item => 
            item.AppUserId == user.Id && 
            item.Symbol == portfolioItem.Symbol && 
            item.Exchange == portfolioItem.Exchange && 
            item.Name == portfolioItem.Name && 
            item.Type == portfolioItem.Type);
        
        // we reject the operation if the portfolio item does not exist for the user
        if (existingPortfolioItem == null) return null;
        
        existingPortfolioItem.Count = portfolioItem.Count;
        existingPortfolioItem.AveragePrice = portfolioItem.AveragePrice;
        await context.SaveChangesAsync();
        
        return portfolioItem;
    }

    public Task<PortfolioItem?> DeletePortfolioItem(AppUser user, PortfolioItem portfolioItem)
    {
        throw new NotImplementedException();
    }
}