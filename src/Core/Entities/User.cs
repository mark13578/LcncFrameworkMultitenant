using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/User.cs
namespace Core.Entities
{
    public class User : BaseEntity
    {
        public required string Username { get; set; }
        public required string PasswordHash { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;

        // 關鍵：標示使用者屬於哪個租戶
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        public Guid DepartmentId { get; set; }
        public Department? Department { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}