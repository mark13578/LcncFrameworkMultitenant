// src/WebAPI/Controllers/RolesController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class RolesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public RolesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/roles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            var tenantId = GetTenantId();
            var roles = await _unitOfWork.Roles.GetAllByTenantAsync(tenantId);
            var roleDtos = roles.Select(r => new RoleDto { Id = r.Id, Name = r.Name, Description = r.Description });
            return Ok(roleDtos);
        }

        // GET: api/roles/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDto>> GetRoleById(Guid id)
        {
            var tenantId = GetTenantId();
            var role = await _unitOfWork.Roles.GetByIdAsync(id);

            if (role == null || role.TenantId != tenantId)
            {
                return NotFound();
            }

            var dto = new RoleDto { Id = role.Id, Name = role.Name, Description = role.Description };
            return Ok(dto);
        }

        // POST: api/roles
        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleDto createDto)
        {
            var tenantId = GetTenantId();

            // 檢查在同一個租戶下是否已有同名角色
            var existingRole = (await _unitOfWork.Roles.GetAllByTenantAsync(tenantId)).FirstOrDefault(r => r.Name == createDto.Name);
            if (existingRole != null)
            {
                return BadRequest("該租戶下已存在同名的角色。");
            }

            var role = new Role
            {
                Name = createDto.Name,
                Description = createDto.Description,
                TenantId = tenantId
            };

            await _unitOfWork.Roles.AddAsync(role);
            await _unitOfWork.CompleteAsync();

            var dto = new RoleDto { Id = role.Id, Name = role.Name, Description = role.Description };
            return CreatedAtAction(nameof(GetRoleById), new { id = role.Id }, dto);
        }

        // PUT: api/roles/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(Guid id, UpdateRoleDto updateDto)
        {
            var tenantId = GetTenantId();
            var role = await _unitOfWork.Roles.GetByIdAsync(id);

            if (role == null || role.TenantId != tenantId)
            {
                return NotFound();
            }

            role.Name = updateDto.Name;
            role.Description = updateDto.Description;

            _unitOfWork.Roles.Update(role);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/roles/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(Guid id)
        {
            var tenantId = GetTenantId();
            var role = await _unitOfWork.Roles.GetByIdAsync(id);

            if (role == null || role.TenantId != tenantId)
            {
                return NotFound();
            }

            // 業務邏輯檢查：不允許刪除仍有使用者在使用的角色
            if (await _unitOfWork.Roles.IsRoleInUseAsync(id))
            {
                return BadRequest("無法刪除：此角色仍有使用者正在使用。");
            }

            _unitOfWork.Roles.Remove(role);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // --- ↓↓ 新增的權限管理端點 ↓↓ ---

        // GET: api/roles/{roleId}/menu-permissions
        [HttpGet("{roleId}/menu-permissions")]
        public async Task<ActionResult<IEnumerable<Guid>>> GetMenuPermissions(Guid roleId)
        {
            var tenantId = GetTenantId();
            var role = await _unitOfWork.Roles.GetByIdAsync(roleId);
            if (role == null || role.TenantId != tenantId)
            {
                return NotFound("找不到指定的角色。");
            }

            var permissions = await _unitOfWork.Roles.GetMenuPermissionsAsync(roleId);
            return Ok(permissions.Select(p => p.MenuItemId));
        }

        // PUT: api/roles/{roleId}/menu-permissions
        [HttpPut("{roleId}/menu-permissions")]
        public async Task<IActionResult> UpdateMenuPermissions(Guid roleId, [FromBody] List<Guid> menuItemIds)
        {
            var tenantId = GetTenantId();
            var role = await _unitOfWork.Roles.GetByIdAsync(roleId);
            if (role == null || role.TenantId != tenantId)
            {
                return NotFound("找不到指定的角色。");
            }

            _unitOfWork.Roles.UpdateMenuPermissions(roleId, menuItemIds);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}