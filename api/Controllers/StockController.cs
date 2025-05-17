using api.Data;
using api.Dtos.Stock;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/stock")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly ApplicationDBContext _context;
    private readonly IStockRepository _stockRepo;
    
    public StockController(ApplicationDBContext context, IStockRepository stockRepo)
    {
        _stockRepo = stockRepo;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var stocks = await _stockRepo.GetAllAsync();
        var stockDto = stocks.Select(s => s.ToStockDto());

        return Ok(stocks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var stock = await _stockRepo.GetByIdAsync(id);

        if (stock == null)
        {
            return NotFound();
        }
        
        return Ok(stock.ToStockDto());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStockRequestDto stockDto)
    {
        var stockModel = stockDto.ToStockFromCreateDto();
        await _stockRepo.CreateAsync(stockModel);
        
        /*
         * this return is essential for RESTful practices because:
         * - it returns the correct HTTP status code
         * - it provides the url of the newly created resource
         * - it returns the representation of the created resource
         */
        return CreatedAtAction(nameof(GetById), new { id = stockModel.Id }, stockModel.ToStockDto());
    }

    [HttpPut]
    [Route("{id}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateStockRequestDto updateDto)
    {
        var stockModel = await _stockRepo.UpdateAsync(id, updateDto);

        // check if the id is valid or not
        if (stockModel == null)
        {
            return NotFound();
        }
        
        return Ok(stockModel.ToStockDto());
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> Delete([FromRoute] int id)
    {
        var stockModel = await _stockRepo.DeleteAsync(id);

        // check if the id is valid or not
        if (stockModel == null)
        {
            return NotFound();
        }
        
        // success return for deleting
        return NoContent();
    }
}