using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalentMatch.Api.Data;
using TalentMatch.Api.Domain.Entities;
using TalentMatch.Api.DTOs.Auth;
using TalentMatch.Api.Services;

namespace TalentMatch.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly JwtTokenService _jwt;

        public AuthController(ApplicationDbContext db, JwtTokenService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            var exists = await _db.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
                return BadRequest("User already exists");

            var user = new User
            {
                Email = request.Email,
                PasswordHash = PasswordHasher.Hash(request.Password)
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok();
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null ||
                !PasswordHasher.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            var tokenResult = _jwt.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = tokenResult.Token,
                ExpiresAt = tokenResult.ExpiresAt
            });
        }
    }
}