using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class AnnouncementDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTimeOffset PublishDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool IsPublished { get; set; }
    }

    public class CreateAnnouncementDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTimeOffset PublishDate { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool IsPublished { get; set; } = true;
    }

    public class UpdateAnnouncementDto
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public DateTimeOffset PublishDate { get; set; }
        public DateTimeOffset? ExpiryDate { get; set; }
        public bool IsPublished { get; set; }
    }
}
