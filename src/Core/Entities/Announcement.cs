using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Announcement.cs
using System.ComponentModel.DataAnnotations;

namespace Core.Entities
{
    public class Announcement : BaseEntity
    {
        [Required]
        public required string Title { get; set; }

        [Required]
        public required string Content { get; set; }

        public DateTimeOffset PublishDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool IsPublished { get; set; } = true;

        // 多租戶關聯
        public Guid TenantId { get; set; }
        public Tenant? Tenant { get; set; }
    }
}
