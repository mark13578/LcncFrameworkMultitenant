using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities;
namespace Core.Interfaces
{
    public interface ISystemParameterRepository
    {
        Task<SystemParameter?> GetByIdAsync(Guid id);
        Task<IEnumerable<SystemParameter>> GetByCategoryAsync(Guid tenantId, string category);
        Task AddAsync(SystemParameter parameter);
        void Update(SystemParameter parameter);
        void Remove(SystemParameter parameter);
    }
}
