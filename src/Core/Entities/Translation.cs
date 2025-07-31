using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Translation.cs
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Translation : BaseEntity
    {
        [Required]
        public required string LanguageCode { get; set; } // e.g., "en-US", "zh-TW"

        [Required]
        public required string Key { get; set; } // e.g., "dashboard.welcome_message"

        [Required]
        public required string Value { get; set; } // e.g., "Welcome to the dashboard!"

        // 多租戶關聯
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}