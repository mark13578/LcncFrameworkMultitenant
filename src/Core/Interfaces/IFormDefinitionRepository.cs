using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IFormDefinitionRepository.cs
using Core.Entities;

namespace Core.Interfaces
{
    public interface IFormDefinitionRepository
    {
        Task<FormDefinition?> GetByIdWithFieldsAsync(Guid id);
        Task<FormDefinition?> GetByNameAsync(string name);

        Task<IEnumerable<FormDefinition>> GetAllByTenantAsync(Guid tenantId); // <-- 加入這行
        Task AddAsync(FormDefinition formDefinition);

    }
}