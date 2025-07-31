using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/UserDto.cs
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos
{
    // 用於回傳使用者列表的 DTO
    public class UserDto
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public string? DepartmentName { get; set; }
        public List<string> Roles { get; set; } = new();
    }

    // 用於回傳單一使用者詳細資訊的 DTO
    public class UserDetailDto
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        public Guid DepartmentId { get; set; }
        public List<Guid> RoleIds { get; set; } = new();
    }

    // 用於新增使用者的 DTO
    public class CreateUserDto
    {
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Password { get; set; }
        public string? Email { get; set; }
        public bool IsActive { get; set; } = true;
        [Required]
        public Guid DepartmentId { get; set; }

        [MaxLength(3, ErrorMessage = "一個使用者最多只能有3個角色。")]
        public List<Guid> RoleIds { get; set; } = new();
    }

    // 用於更新使用者的 DTO
    public class UpdateUserDto
    {
        public string? Email { get; set; }
        public bool IsActive { get; set; }
        [Required]
        public Guid DepartmentId { get; set; }

        [MaxLength(3, ErrorMessage = "一個使用者最多只能有3個角色。")]
        public List<Guid> RoleIds { get; set; } = new();
    }
}