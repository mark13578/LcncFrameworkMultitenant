using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Repositories
{
    public class AnnouncementRepository : IAnnouncementRepository
    {
        private readonly ApplicationDbContext _context;
        public AnnouncementRepository(ApplicationDbContext context) { _context = context; }
        public async Task<Announcement?> GetByIdAsync(Guid id) => await _context.Announcements.FindAsync(id);
        public async Task<IEnumerable<Announcement>> GetAllByTenantAsync(Guid tenantId) =>
            await _context.Announcements.Where(a => a.TenantId == tenantId).OrderByDescending(a => a.PublishDate).ToListAsync();
        public async Task AddAsync(Announcement a) => await _context.Announcements.AddAsync(a);
        public void Update(Announcement a) => _context.Announcements.Update(a);
        public void Remove(Announcement a) => _context.Announcements.Remove(a);
    }
}
