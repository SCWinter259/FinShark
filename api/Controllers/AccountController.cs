using api.Dtos.Account;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/account")]
[ApiController]
public class AccountController(
    UserManager<AppUser> userManager,
    ITokenService tokenService,
    SignInManager<AppUser> signInManager)
    : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await userManager.Users.FirstOrDefaultAsync(x => x.UserName == loginDto.Username);

        if (user == null)
        {
            return Unauthorized("Invalid username!");
        }
        
        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
        
        if(!result.Succeeded) return Unauthorized("Username not found and/or password is incorrect!");

        return Ok(new NewUserDto
        {
            // suppress warnings because username and email were required at register
            UserName = user.UserName!,
            Email = user.Email!,
            Token = tokenService.CreateToken(user)
        });
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
            var createUser = await userManager.CreateAsync(appUser, registerDto.Password!);

            if (!createUser.Succeeded) return StatusCode(500, createUser.Errors);

            // assign a role for the new user
            var roleResult = await userManager.AddToRoleAsync(appUser, "User");

            if (roleResult.Succeeded)
            {
                return Ok(
                    new NewUserDto
                    {
                        UserName = appUser.UserName,
                        Email = appUser.Email,
                        Token = tokenService.CreateToken(appUser)
                    });
            }

            return StatusCode(500, roleResult.Errors);
        }
        catch (Exception e)
        {
            return StatusCode(500, e);
        }
    }
}