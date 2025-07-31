using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Infrastructure/Repositories/RoleRepository.cs
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Role?> GetByIdAsync(Guid id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<IEnumerable<Role>> GetAllByTenantAsync(Guid tenantId)
        {
            return await _context.Roles
                .Where(r => r.TenantId == tenantId)
                .ToListAsync();
        }

        public async Task AddAsync(Role role)
        {
            await _context.Roles.AddAsync(role);
        }

        public void Update(Role role)
        {
            _context.Roles.Update(role);
        }

        public void Remove(Role role)
        {
            _context.Roles.Remove(role);
        }

        public async Task<bool> IsRoleInUseAsync(Guid roleId)
        {
            // 檢查是否有任何使用者正在使用這個角色
            return await _context.UserRoles.AnyAsync(ur => ur.RoleId == roleId);
        }

        public async Task<IEnumerable<RoleMenuPermission>> GetMenuPermissionsAsync(Guid roleId)
        {
            return await _context.RoleMenuPermissions
                .Where(p => p.RoleId == roleId)
                .ToListAsync();
        }

        public void UpdateMenuPermissions(Guid roleId, IEnumerable<Guid> menuItemIds)
        {
            // 先刪除該角色所有舊的權限
            var existingPermissions = _context.RoleMenuPermissions.Where(p => p.RoleId == roleId);
            _context.RoleMenuPermissions.RemoveRange(existingPermissions);

            // 再新增所有新的權限
            var newPermissions = menuItemIds.Select(menuId => new RoleMenuPermission
            {
                RoleId = roleId,
                MenuItemId = menuId
            });
            _context.RoleMenuPermissions.AddRange(newPermissions);
        }
    }
}