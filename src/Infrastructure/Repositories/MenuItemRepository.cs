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

        public async Task<IEnumerable<MenuItem>> GetAllowedByRoleIdsAsync(Guid tenantId, IEnumerable<Guid> roleIds)
        {
            // 找出這些角色被授權的所有 MenuItem 的 ID
            var allowedMenuItemIds = await _context.RoleMenuPermissions
                .Where(p => roleIds.Contains(p.RoleId))
                .Select(p => p.MenuItemId)
                .Distinct()
                .ToListAsync();

            // 找出所有租戶的選單，以便建構完整的樹
            var allMenuItems = await _context.MenuItems
                .Where(m => m.TenantId == tenantId)
                .ToListAsync();

            // 找出被授權的選單及其所有的父層選單
            var requiredMenuItems = new HashSet<MenuItem>();
            var queue = new Queue<MenuItem>(allMenuItems.Where(m => allowedMenuItemIds.Contains(m.Id)));

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                if (requiredMenuItems.Add(current) && current.ParentId != null)
                {
                    var parent = allMenuItems.FirstOrDefault(m => m.Id == current.ParentId);
                    if (parent != null)
                    {
                        queue.Enqueue(parent);
                    }
                }
            }

            return requiredMenuItems.ToList();
        }
    }
}