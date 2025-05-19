using api.Dtos.Account;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    
    public AccountController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            // check the request
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // create new user
            var appUser = new AppUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email
            };
            
            // suppress Password null alert because we already validated the DTO above
            var createUser = await _userManager.CreateAsync(appUser, registerDto.Password!);
            
            if (!createUser.Succeeded) return StatusCode(500, createUser.Errors);
            
            // assign a role for the new user
            var roleResult = await _userManager.AddToRoleAsync(appUser, "User");

            return roleResult.Succeeded ? Ok("User created successfully") : StatusCode(500, roleResult.Errors);
        }
        catch (Exception e)
        {
            return StatusCode(500, e);
        }
    }
}