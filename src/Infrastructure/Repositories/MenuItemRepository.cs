using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Repositories
{
    public class MenuItemRepository : IMenuItemRepository
    {
        private readonly ApplicationDbContext _context;
        public MenuItemRepository(ApplicationDbContext context) { _context = context; }
        public async Task<MenuItem?> GetByIdAsync(Guid id) => await _context.MenuItems.FindAsync(id);

        public async Task<MenuItem?> GetByIdWithChildrenAsync(Guid id)
        {
            return await _context.MenuItems.Include(m => m.Children).FirstOrDefaultAsync(m => m.Id == id);
        }


        public async Task<IEnumerable<MenuItem>> GetAllByTenantAsync(Guid tenantId) =>
            await _context.MenuItems.Where(m => m.TenantId == tenantId).OrderBy(m => m.SortOrder).ToListAsync();
        public async Task AddAsync(MenuItem menuItem) => await _context.MenuItems.AddAsync(menuItem);
        public void Update(MenuItem menuItem) => _context.MenuItems.Update(menuItem);
        public void Remove(MenuItem menuItem) => _context.MenuItems.Remove(menuItem);
    }
}