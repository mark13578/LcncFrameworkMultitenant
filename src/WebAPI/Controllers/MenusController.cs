// src/WebAPI/Controllers/MenusController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class MenusController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public MenusController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        // GET: api/menus
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        //{
        //    var tenantId = GetTenantId();
        //    var menuItems = await _unitOfWork.MenuItems.GetAllByTenantAsync(tenantId);

        //    var dtos = menuItems.Select(m => new MenuDto
        //    {
        //        Id = m.Id,
        //        Name = m.Name,
        //        ParentId = m.ParentId,
        //        Icon = m.Icon,
        //        Path = m.Path,
        //        SortOrder = m.SortOrder
        //    }).ToList();

        //    var tree = dtos.Where(d => d.ParentId == null).OrderBy(d => d.SortOrder).ToList();
        //    tree.ForEach(d => AddChildren(d, dtos));

        //    return Ok(tree);
        //}

        /// <summary>
        /// 20250731更新 api/menus 加入權限控制
        /// </summary>
        /// <returns></returns>
        // GET: api/menus
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var tenantId = GetTenantId();
            var userId = GetCurrentUserId();

            var user = await _unitOfWork.Users.GetByIdWithDetailsAsync(userId);
            if (user == null)
            {
                return Unauthorized();
            }
            var roleIds = user.UserRoles.Select(ur => ur.RoleId).ToList();

            // 如果使用者沒有任何角色，直接回傳空選單
            if (!roleIds.Any())
            {
                return Ok(new List<MenuDto>());
            }

            var allowedMenuItems = await _unitOfWork.MenuItems.GetAllowedByRoleIdsAsync(tenantId, roleIds);

            var dtos = allowedMenuItems.Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                ParentId = m.ParentId,
                Icon = m.Icon,
                Path = m.Path,
                SortOrder = m.SortOrder
            }).ToList();

            var tree = dtos.Where(d => d.ParentId == null).OrderBy(d => d.SortOrder).ToList();
            tree.ForEach(d => AddChildren(d, dtos));

            return Ok(tree);
        }

        // ↓↓ 新增這個 API 端點 ↓↓
        // GET: api/menus/all-for-management (給角色管理頁面使用，回傳所有選單)
        [HttpGet("all-for-management")]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetAllForManagement()
        {
            var tenantId = GetTenantId();
            var menuItems = await _unitOfWork.MenuItems.GetAllByTenantAsync(tenantId);

            // ↓↓ 修正點：補全這裡的物件初始化 ↓↓
            var dtos = menuItems.Select(m => new MenuDto
            {
                Id = m.Id,
                Name = m.Name,
                ParentId = m.ParentId,
                Icon = m.Icon,
                Path = m.Path,
                SortOrder = m.SortOrder
            }).ToList();

            var tree = dtos.Where(d => d.ParentId == null).OrderBy(d => d.SortOrder).ToList();
            tree.ForEach(d => AddChildren(d, dtos));

            return Ok(tree);
        }

        private void AddChildren(MenuDto parent, List<MenuDto> all)
        {
            parent.Children = all.Where(d => d.ParentId == parent.Id).OrderBy(d => d.SortOrder).ToList();
            parent.Children.ForEach(d => AddChildren(d, all));
        }

        // POST: api/menus
        [HttpPost]
        public async Task<IActionResult> CreateMenuItem(CreateMenuDto createDto)
        {
            var tenantId = GetTenantId();
            var menuItem = new MenuItem
            {
                Name = createDto.Name,
                Icon = createDto.Icon,
                Path = createDto.Path,
                SortOrder = createDto.SortOrder,
                ParentId = createDto.ParentId,
                TenantId = tenantId
            };

            await _unitOfWork.MenuItems.AddAsync(menuItem);
            await _unitOfWork.CompleteAsync();

            // 修正點：補全這裡的物件初始化 ↓↓
            var resultDto = MapToDto(menuItem);
            return Ok(menuItem);
        }

        // PUT: api/menus/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(Guid id, UpdateMenuDto updateDto)
        {
            var tenantId = GetTenantId();
            var menuItem = await _unitOfWork.MenuItems.GetByIdAsync(id);

            // 安全性檢查：確保項目存在且屬於當前租戶
            if (menuItem == null || menuItem.TenantId != tenantId)
            {
                return NotFound();
            }

            // 更新屬性
            menuItem.Name = updateDto.Name;
            menuItem.Icon = updateDto.Icon;
            menuItem.Path = updateDto.Path;
            menuItem.SortOrder = updateDto.SortOrder;
            menuItem.ParentId = updateDto.ParentId;

            _unitOfWork.MenuItems.Update(menuItem);
            await _unitOfWork.CompleteAsync();

            return NoContent(); // HTTP 204
        }

        // DELETE: api/menus/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMenuItem(Guid id)
        {
            var tenantId = GetTenantId();
            var menuItem = await _unitOfWork.MenuItems.GetByIdWithChildrenAsync(id); // 使用新方法獲取子項目

            // 安全性檢查
            if (menuItem == null || menuItem.TenantId != tenantId)
            {
                return NotFound();
            }

            // 業務邏輯檢查：不允許刪除含有子選單的項目
            if (menuItem.Children.Any())
            {
                return BadRequest("無法刪除：該選單項目底下仍有子選單。");
            }

            _unitOfWork.MenuItems.Remove(menuItem);
            await _unitOfWork.CompleteAsync();

            return NoContent(); // HTTP 204
        }

        private MenuDto MapToDto(MenuItem menuItem)
        {
            return new MenuDto
            {
                Id = menuItem.Id,
                Name = menuItem.Name,
                ParentId = menuItem.ParentId,
                Icon = menuItem.Icon,
                Path = menuItem.Path,
                SortOrder = menuItem.SortOrder
            };
        }
    }
}