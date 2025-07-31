using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
// src/Application/Dtos/UserProfileDto.cs
namespace Application.Dtos
{
    public class UserProfileDto
    {
        public Guid Id { get; set; }
        public required string Username { get; set; }
        public string? Email { get; set; }
    }
}