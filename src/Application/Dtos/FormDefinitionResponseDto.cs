using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/FormDefinitionResponseDto.cs
namespace Application.Dtos
{
    public class FormDefinitionResponseDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string DisplayName { get; set; }
        public string? Description { get; set; }
        public required string UserDataTableName { get; set; }
        public List<FieldDefinitionResponseDto> Fields { get; set; } = new();
    }
}