using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/LoginResponseDto.cs
namespace Application.Dtos
{
    public class LoginResponseDto
    {
        public required string Token { get; set; }
    }
}
