using api.Dtos.Stock;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Newtonsoft.Json;

namespace api.Service;

public class FMPService : IFMPService
{
    private HttpClient _httpClient;
    private IConfiguration _config;
    
    public FMPService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }
    
    public async Task<Stock?> FindStockBySymbolAsync(string symbol)
    {
        try
        {
            // basically equivalent to a fetch in JS
            var result = await _httpClient.GetAsync(
                $"https://financialmodelingprep.com/stable/profile?symbol={symbol}&apikey={_config["FMPKey"]}");

            if (result.IsSuccessStatusCode)
            {
                var content = await result.Content.ReadAsStringAsync();
                var tasks = JsonConvert.DeserializeObject<FMPStock[]>(content);

                if (tasks == null) return null;
                
                var stock = tasks[0];
                return stock.ToStockFromFMP();
            }

            return null;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return null;
        }
    }
}