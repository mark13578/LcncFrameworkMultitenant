using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Department.cs
namespace Core.Entities
{
    public class Department : BaseEntity
    {
        public required string Name { get; set; } // 例如: "研發部", "市場部"

        // 關鍵：標示這個部門屬於哪個租戶
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }

        // 部門自身的階層關係
        public Guid? ParentId { get; set; }
        public Department? Parent { get; set; }
        public ICollection<Department> Children { get; set; } = new List<Department>();

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}