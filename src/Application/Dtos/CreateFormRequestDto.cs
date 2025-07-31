using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/CreateFormRequestDto.cs
namespace Application.Dtos
{
    public class CreateFormRequestDto
    {
        public required string Name { get; set; }
        public required string DisplayName { get; set; }
        public string? Description { get; set; }
        public required List<CreateFieldDto> Fields { get; set; }
    }
}