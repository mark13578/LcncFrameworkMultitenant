// src/WebAPI/Controllers/AuthController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // private readonly ApplicationDbContext _context;
        private readonly IUnitOfWork _unitOfWork; // 修改
        private readonly IConfiguration _configuration;

        //public AuthController(ApplicationDbContext context, IConfiguration configuration)
        //{
        //    _context = context;
        //    _configuration = configuration;
        //}

        // 修改建構函式
        public AuthController(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            //var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            //if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            //{
            //    return Unauthorized(new { message = "無效的使用者名稱或密碼" });
            //}

            //var token = GenerateJwtToken(user);
            //return Ok(new LoginResponseDto { Token = token });

            // 使用新的 Repository 方法
            var user = await _unitOfWork.Users.GetByUsernameAsync(request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "無效的使用者名稱或密碼" });
            }

            var token = GenerateJwtToken(user);
            return Ok(new LoginResponseDto { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                // 加入TenantID
                new Claim("tenantId", user.TenantId.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8), // Token 有效期 8 小時
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}