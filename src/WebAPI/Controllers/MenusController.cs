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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
        {
            var tenantId = GetTenantId();
            var menuItems = await _unitOfWork.MenuItems.GetAllByTenantAsync(tenantId);

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
    }
}