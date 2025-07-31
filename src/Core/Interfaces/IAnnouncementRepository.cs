using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Entities;
namespace Core.Interfaces
{
    public interface IAnnouncementRepository
    {
        Task<Announcement?> GetByIdAsync(Guid id);
        Task<IEnumerable<Announcement>> GetAllByTenantAsync(Guid tenantId);
        Task AddAsync(Announcement announcement);
        void Update(Announcement announcement);
        void Remove(Announcement announcement);
    }
}
