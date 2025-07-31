// src/Core/Entities/SystemParameter.cs
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class SystemParameter : BaseEntity
    {
        [Required]
        public required string Category { get; set; } // 用於分類，例如 "Dictionary", "System"

        [Required]
        public required string Key { get; set; } // 鍵，例如 "order_status" 或 "site_title"

        public string? Value { get; set; } // 值，可以儲存簡單字串或 JSON 字串

        public string? DisplayName { get; set; } // 對應「参数名称」，提供更友善的顯示名稱

        public bool IsSystemLocked { get; set; } = false; // 對應「系统内置」，預設為 false (非內置)

        public string? Description { get; set; } // 描述

        // 多租戶關聯
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
