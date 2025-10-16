using api.Models;

namespace api.Interfaces;

public interface IPortfolioItemRepository
{
    Task<List<PortfolioItem>> GetUserPortfolioItems(AppUser user);
    Task<PortfolioItem?> AddPortfolioItem(AppUser user, PortfolioItem portfolioItem);
    Task<PortfolioItem?> UpdatePortfolioItem(AppUser user, PortfolioItem portfolioItem);
    Task<PortfolioItem?> DeletePortfolioItem(AppUser user, PortfolioItem portfolioItem);
}