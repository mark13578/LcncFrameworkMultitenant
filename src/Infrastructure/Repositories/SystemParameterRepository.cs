using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class SystemParameterRepository : ISystemParameterRepository
    {
        private readonly ApplicationDbContext _context;
        public SystemParameterRepository(ApplicationDbContext context) { _context = context; }
        public async Task<SystemParameter?> GetByIdAsync(Guid id) => await _context.SystemParameters.FindAsync(id);
        public async Task<IEnumerable<SystemParameter>> GetByCategoryAsync(Guid tenantId, string category) =>
            await _context.SystemParameters.Where(p => p.TenantId == tenantId && p.Category == category).ToListAsync();
        public async Task AddAsync(SystemParameter p) => await _context.SystemParameters.AddAsync(p);
        public void Update(SystemParameter p) => _context.SystemParameters.Update(p);
        public void Remove(SystemParameter p) => _context.SystemParameters.Remove(p);
    }
}
