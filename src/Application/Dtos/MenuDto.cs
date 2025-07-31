using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/MenuDto.cs
namespace Application.Dtos
{
    public class MenuDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Icon { get; set; }
        public required string Path { get; set; }
        public int SortOrder { get; set; }
        public Guid? ParentId { get; set; }
        public List<MenuDto> Children { get; set; } = new();
    }

    public class CreateMenuDto
    {
        public required string Name { get; set; }
        public string? Icon { get; set; }
        public required string Path { get; set; }
        public int SortOrder { get; set; } = 0;
        public Guid? ParentId { get; set; }
    }

    public class UpdateMenuDto : CreateMenuDto { }
}