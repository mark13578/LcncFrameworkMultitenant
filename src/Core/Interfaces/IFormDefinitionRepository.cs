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
        Task AddAsync(FormDefinition formDefinition);
        Task<FormDefinition?> GetByNameAsync(string name);
    }
}