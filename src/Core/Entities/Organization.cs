using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/Organization.cs
namespace Core.Entities
{
    public class Organization : BaseEntity
    {
        public required string Name { get; set; }
        public Guid? ParentId { get; set; }
        public Organization? Parent { get; set; }
        public ICollection<Organization> Children { get; set; } = new List<Organization>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
