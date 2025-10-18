using api.Models;

namespace api.Interfaces;

public interface IPortfolioItemRepository
{
    Task<List<PortfolioItem>> GetUserPortfolioItems(AppUser user);
    Task<PortfolioItem?> AddPortfolioItem(PortfolioItem portfolioItem);
    Task<PortfolioItem?> UpdatePortfolioItem(PortfolioItem portfolioItem);
    Task<PortfolioItem?> DeletePortfolioItem(PortfolioItem portfolioItem);
}