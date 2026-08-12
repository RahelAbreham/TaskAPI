using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using TaskApi.Data;
using TaskApi.DTOs;
using TaskApi.Models;

namespace TaskApi.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthService> _logger;
    private readonly PasswordHasher<User> _hasher = new();

    public AuthService(AppDbContext context, IConfiguration config, ILogger<AuthService> logger)
    {
        _context = context;
        _config = config;
        _logger = logger;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
    {
        var exists = await _context.Users.AnyAsync(u => u.Username == dto.Username);
        if (exists) return null; // Controller turns this into a 409 Conflict.

        var user = new User { Username = dto.Username };
        user.PasswordHash = _hasher.HashPassword(user, dto.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        _logger.LogInformation("New user registered: {Username}", dto.Username);

        return BuildToken(user);
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null) return null;

        var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed) return null;

        return BuildToken(user);
    }

    private AuthResponseDto BuildToken(User user)
    {
        var jwtSection = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiryMinutes = int.Parse(jwtSection["ExpiryMinutes"] ?? "60");
        var expires = DateTime.UtcNow.AddMinutes(expiryMinutes);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            ExpiresAtUtc = expires,
            Username = user.Username
        };
    }
}
