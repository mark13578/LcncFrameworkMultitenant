using Microsoft.AspNetCore.Mvc;

using Application.Dtos;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization; // 引用
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // <--- 關鍵！保護整個 Controller
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public UsersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            // 從傳入 Token 的 Claims 中取得使用者 ID
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdString == null || !Guid.TryParse(userIdString, out var userId))
            {
                return Unauthorized();
            }

            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            // 將 User 實體映射到安全的回傳物件 DTO
            var userProfile = new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email
            };

            return Ok(userProfile);
        }
    }
}
