using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Organization.cs
namespace Core.Entities
{
    public class Tenant : BaseEntity
    {
        //public required string Name { get; set; }
        //public Guid? ParentId { get; set; }
        //public Tenant? Parent { get; set; }
        //public ICollection<Tenant> Children { get; set; } = new List<Tenant>();
        //public ICollection<User> Users { get; set; } = new List<User>();

        public required string Name { get; set; } // 例如: "A 公司", "B 公司"
        // 未來可以增加租戶專屬的設定，例如 Domain, IsActive 等
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Department> Departments { get; set; } = new List<Department>();
    }
}
