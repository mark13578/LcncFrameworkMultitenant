using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/RoleMenuPermission.cs
namespace Core.Entities
{
    public class RoleMenuPermission
    {
        public Guid RoleId { get; set; }
        public Role? Role { get; set; }

        public Guid MenuItemId { get; set; }
        public MenuItem? MenuItem { get; set; }
    }
}