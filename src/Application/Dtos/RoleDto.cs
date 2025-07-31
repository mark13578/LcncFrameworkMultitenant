using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/RoleDto.cs
namespace Application.Dtos
{
    // 用於回傳角色資訊的 DTO
    public class RoleDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    // 用於新增角色的 DTO
    public class CreateRoleDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }

    // 用於更新角色的 DTO
    public class UpdateRoleDto
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
    }
}