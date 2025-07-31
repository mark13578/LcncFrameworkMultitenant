using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Core.Entities;
namespace Core.Interfaces
{
    public interface IMenuItemRepository
    {
        Task<IEnumerable<MenuItem>> GetAllByTenantAsync(Guid tenantId);
        Task<MenuItem?> GetByIdAsync(Guid id);

        Task<MenuItem?> GetByIdWithChildrenAsync(Guid id);
        Task AddAsync(MenuItem menuItem);
        void Update(MenuItem menuItem);
        void Remove(MenuItem menuItem);
    }
}