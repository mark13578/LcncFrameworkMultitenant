using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Infrastructure/Repositories/DepartmentRepository.cs
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly ApplicationDbContext _context;

        public DepartmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Department?> GetByIdAsync(Guid id)
        {
            return await _context.Departments.FindAsync(id);
        }

        // 實現新方法
        public async Task<Department?> GetByIdWithDetailsAsync(Guid id)
        {
            return await _context.Departments
                .Include(d => d.Children) // 加載子部門
                .Include(d => d.Users)    // 加載使用者
                .FirstOrDefaultAsync(d => d.Id == id);
        }
        public async Task<IEnumerable<Department>> GetAllByTenantAsync(Guid tenantId)
        {
            return await _context.Departments
                .Where(d => d.TenantId == tenantId)
                .ToListAsync();
        }

        public async Task AddAsync(Department department)
        {
            await _context.Departments.AddAsync(department);
        }

        public void Update(Department department)
        {
            _context.Departments.Update(department);
        }

        public void Remove(Department department)
        {
            _context.Departments.Remove(department);
        }
    }
}