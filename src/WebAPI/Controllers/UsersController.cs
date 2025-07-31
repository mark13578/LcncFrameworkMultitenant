// src/WebAPI/Controllers/UsersController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public UsersController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // --- 從 UserController.cs 合併過來的方法 ---
        // GET: api/users/me
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetMyProfile()
        {
            var userId = GetCurrentUserId(); // 使用 BaseApiController 的輔助方法
            var user = await _unitOfWork.Users.GetByIdWithDetailsAsync(userId);

            if (user == null)
            {
                return Unauthorized();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsActive = user.IsActive,
                DepartmentName = user.Department?.Name,
                Roles = user.UserRoles.Select(ur => ur.Role!.Name).ToList()
            };

            return Ok(userDto);
        }

        // --- UsersController.cs 原有的方法 ---

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var tenantId = GetTenantId();
            var users = await _unitOfWork.Users.GetAllByTenantWithDetailsAsync(tenantId);

            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                IsActive = u.IsActive,
                DepartmentName = u.Department?.Name,
                Roles = u.UserRoles.Select(ur => ur.Role!.Name).ToList()
            });

            return Ok(userDtos);
        }

        // GET: api/users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDetailDto>> GetUserById(Guid id)
        {
            var tenantId = GetTenantId();
            var user = await _unitOfWork.Users.GetByIdWithDetailsAsync(id);

            if (user == null || user.TenantId != tenantId)
            {
                return NotFound();
            }

            var dto = new UserDetailDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsActive = user.IsActive,
                DepartmentId = user.DepartmentId,
                RoleIds = user.UserRoles.Select(ur => ur.RoleId).ToList()
            };
            return Ok(dto);
        }

        // POST: api/users
        [HttpPost]
        public async Task<IActionResult> CreateUser(CreateUserDto createDto)
        {
            var tenantId = GetTenantId();

            var department = await _unitOfWork.Departments.GetByIdAsync(createDto.DepartmentId);
            if (department == null || department.TenantId != tenantId)
            {
                return BadRequest("指定的部門無效。");
            }

            var user = new User
            {
                Username = createDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createDto.Password),
                Email = createDto.Email,
                IsActive = createDto.IsActive,
                DepartmentId = createDto.DepartmentId,
                TenantId = tenantId
            };

            var roles = (await _unitOfWork.Roles.GetAllByTenantAsync(tenantId))
                        .Where(r => createDto.RoleIds.Contains(r.Id)).ToList();
            user.UserRoles = roles.Select(r => new UserRole { User = user, Role = r }).ToList();

            await _unitOfWork.Users.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        // PUT: api/users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto updateDto)
        {
            var tenantId = GetTenantId();
            var user = await _unitOfWork.Users.GetByIdWithDetailsAsync(id);

            if (user == null || user.TenantId != tenantId)
            {
                return NotFound();
            }

            var department = await _unitOfWork.Departments.GetByIdAsync(updateDto.DepartmentId);
            if (department == null || department.TenantId != tenantId)
            {
                return BadRequest("指定的部門無效。");
            }

            user.Email = updateDto.Email;
            user.IsActive = updateDto.IsActive;
            user.DepartmentId = updateDto.DepartmentId;
            _unitOfWork.Users.Update(user);

            var newRoles = (await _unitOfWork.Roles.GetAllByTenantAsync(tenantId))
                           .Where(r => updateDto.RoleIds.Contains(r.Id)).ToList();
            _unitOfWork.Users.UpdateUserRoles(user, newRoles);

            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}