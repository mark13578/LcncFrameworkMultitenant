using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/FieldDefinitionResponseDto.cs
using Core.Enums;

namespace Application.Dtos
{
    public class FieldDefinitionResponseDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Label { get; set; }
        public FieldType FieldType { get; set; }
        public bool IsRequired { get; set; }
        public int SortOrder { get; set; }
        public string? ConfigurationJson { get; set; }
    }
}