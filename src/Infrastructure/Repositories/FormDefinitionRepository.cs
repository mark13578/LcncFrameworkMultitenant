// src/Infrastructure/Repositories/FormDefinitionRepository.cs
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FormDefinitionRepository : IFormDefinitionRepository
    {
        private readonly ApplicationDbContext _context;

        public FormDefinitionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(FormDefinition formDefinition)
        {
            await _context.FormDefinitions.AddAsync(formDefinition);
        }

        public async Task<FormDefinition?> GetByIdWithFieldsAsync(Guid id)
        {
            return await _context.FormDefinitions
                .Include(f => f.Fields)
                .FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<FormDefinition?> GetByNameAsync(string name)
        {
            return await _context.FormDefinitions
                .Include(f => f.Fields)
                .FirstOrDefaultAsync(f => f.Name == name);
        }

        public async Task<IEnumerable<FormDefinition>> GetAllByTenantAsync(Guid tenantId) // <-- 加入這個方法
        {
            return await _context.FormDefinitions
                .Where(f => f.TenantId == tenantId)
                .ToListAsync();
        }
    }
}