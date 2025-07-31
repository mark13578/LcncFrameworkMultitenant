using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IUserRepository.cs
using Core.Entities;

namespace Core.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(Guid id);
        Task<User?> GetByUsernameAsync(string username);
        Task<User?> GetByIdWithDetailsAsync(Guid id);
        Task<IEnumerable<User>> GetAllByTenantWithDetailsAsync(Guid tenantId);
        Task AddAsync(User user);
        void Update(User user); // 更新使用者基本資料
        void UpdateUserRoles(User user, List<Role> roles); // 單獨更新角色關聯
    }
}
