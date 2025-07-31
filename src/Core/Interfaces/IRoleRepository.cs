using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IRoleRepository.cs
using Core.Entities;

namespace Core.Interfaces
{
    public interface IRoleRepository
    {
        Task<Role?> GetByIdAsync(Guid id);
        Task<IEnumerable<Role>> GetAllByTenantAsync(Guid tenantId);
        Task AddAsync(Role role);
        void Update(Role role);
        void Remove(Role role);
        Task<bool> IsRoleInUseAsync(Guid roleId);
        // 用於處理權限的更新
        Task<IEnumerable<RoleMenuPermission>> GetMenuPermissionsAsync(Guid roleId);
        void UpdateMenuPermissions(Guid roleId, IEnumerable<Guid> menuItemIds);
    }
}
