using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Role.cs
namespace Core.Entities
{
    public class Role : BaseEntity
    {
        public required string Name { get; set; }
        public string? Description { get; set; }

        // 關鍵：標示角色屬於哪個租戶
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; } // 導覽屬性可選
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}