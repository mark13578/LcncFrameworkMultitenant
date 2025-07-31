using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/MenuItem.cs
namespace Core.Entities
{
    public class MenuItem : BaseEntity
    {
        public required string Name { get; set; } // 選單上顯示的文字，例如 "使用者管理"
        public string? Icon { get; set; } // 對應前端 Icon 的名稱，例如 "People"
        public required string Path { get; set; } // 對應前端的路由路徑，例如 "/management/users"
        public int SortOrder { get; set; } = 0; // 排序

        // 階層關係
        public Guid? ParentId { get; set; }
        public MenuItem? Parent { get; set; }
        public ICollection<MenuItem> Children { get; set; } = new List<MenuItem>();

        // 多租戶關聯
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
