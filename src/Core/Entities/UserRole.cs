using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/UserRole.cs
namespace Core.Entities
{
    public class UserRole
    {
        public Guid UserId { get; set; }
        public User? User { get; set; }

        public Guid RoleId { get; set; }
        public Role? Role { get; set; }
    }
}