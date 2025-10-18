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
            AppUser = item.AppUser,
            AppUserId = item.AppUserId,
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
    /// <param name="portfolioItem">A PortfolioItem object</param>
    /// <returns>The added PortfolioItem</returns>
    public async Task<PortfolioItem?> AddPortfolioItem(PortfolioItem portfolioItem)
    {
        var existingPortfolioItem = await context.PortfolioItems.FirstOrDefaultAsync(item => 
            item.AppUserId == portfolioItem.AppUserId && 
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
    /// <param name="portfolioItem">A PortfolioItem object</param>
    /// <returns>The updated PortfolioItem</returns>
    public async Task<PortfolioItem?> UpdatePortfolioItem(PortfolioItem portfolioItem)
    {
        var existingPortfolioItem = await context.PortfolioItems.FirstOrDefaultAsync(item => 
            item.AppUserId == portfolioItem.AppUserId && 
            item.Symbol == portfolioItem.Symbol && 
            item.Exchange == portfolioItem.Exchange && 
            item.Name == portfolioItem.Name && 
            item.Type == portfolioItem.Type);
        
        // we reject the operation if the portfolio item does not exist for the user
        if (existingPortfolioItem == null) return null;
        
        /*
         * The intention here is, if anything other than Count and AveragePrice needs to be changed,
         * like if there is a Name change, we'll just notify the user that something in our db no longer exist,
         * the user would have to delete it and go find and save a new stock/ETF.
         */
        existingPortfolioItem.Count = portfolioItem.Count;
        existingPortfolioItem.AveragePrice = portfolioItem.AveragePrice;
        await context.SaveChangesAsync();
        
        return existingPortfolioItem;
    }

    /// <summary>
    /// Delete a PortfolioItem
    /// </summary>
    /// <param name="portfolioItem">A PortfolioItem object</param>
    /// <returns>The deleted PortfolioItem</returns>
    public async Task<PortfolioItem?> DeletePortfolioItem(PortfolioItem portfolioItem)
    {
        var existingPortfolioItem = await context.PortfolioItems.FirstOrDefaultAsync(item => 
            item.AppUserId == portfolioItem.AppUserId && 
            item.Symbol == portfolioItem.Symbol && 
            item.Exchange == portfolioItem.Exchange && 
            item.Name == portfolioItem.Name && 
            item.Type == portfolioItem.Type);
        
        // we reject the operation if the portfolio item does not exist for the user
        if (existingPortfolioItem == null) return null;

        context.PortfolioItems.Remove(existingPortfolioItem);
        await context.SaveChangesAsync();
        return existingPortfolioItem;
    }
}