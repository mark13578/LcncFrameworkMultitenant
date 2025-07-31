using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Infrastructure/Repositories/UserRepository.cs
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<User?> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.Users
                .Include(u => u.Department)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<IEnumerable<User>> GetAllByTenantWithDetailsAsync(Guid tenantId)
        {
            return await _context.Users
                .Where(u => u.TenantId == tenantId)
                .Include(u => u.Department)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .ToListAsync();
        }

        public async Task AddAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        // --- 補上這裡缺少的 Update 方法 ---
        public void Update(User user)
        {
            _context.Users.Update(user);
        }

        // --- 補上這裡缺少的 UpdateUserRoles 方法 ---
        public void UpdateUserRoles(User user, List<Role> newRoles)
        {
            // 簡單高效的做法：先刪除舊關聯，再新增新關聯
            // 確保 user.UserRoles 已經被加載
            if (user.UserRoles != null)
            {
                _context.UserRoles.RemoveRange(user.UserRoles);
            }

            var newUserRoles = newRoles.Select(role => new UserRole { UserId = user.Id, RoleId = role.Id }).ToList();
            _context.UserRoles.AddRange(newUserRoles);
        }
    }
}