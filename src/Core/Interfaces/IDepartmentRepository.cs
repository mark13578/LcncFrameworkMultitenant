using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IDepartmentRepository.cs
using Core.Entities;

namespace Core.Interfaces
{
    public interface IDepartmentRepository
    {
        Task<Department?> GetByIdAsync(Guid id);
        // 用於刪除前檢查關聯資料
        Task<Department?> GetByIdWithDetailsAsync(Guid id);
        Task<IEnumerable<Department>> GetAllByTenantAsync(Guid tenantId);
        Task AddAsync(Department department);
        void Update(Department department);
        void Remove(Department department);
    }
}