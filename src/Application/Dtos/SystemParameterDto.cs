using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class SystemParameterDto
    {
        public Guid Id { get; set; }
        public required string Category { get; set; }
        public required string Key { get; set; }
        public string? Value { get; set; }
        public string? DisplayName { get; set; } 
        public bool IsSystemLocked { get; set; } 
        public string? Description { get; set; }
    }

    public class CreateSystemParameterDto
    {
        public required string Category { get; set; }
        public required string Key { get; set; }
        public string? Value { get; set; }
        public string? DisplayName { get; set; } 
        public bool IsSystemLocked { get; set; } = false; 
        public string? Description { get; set; }
    }

    public class UpdateSystemParameterDto
    {
        public string? Value { get; set; }
        public string? DisplayName { get; set; } 

        public string? Description { get; set; }
    }
}
