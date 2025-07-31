using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/DepartmentDto.cs
namespace Application.Dtos
{
    // 用於回傳部門資訊的 DTO
    public class DepartmentDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public Guid? ParentId { get; set; }
        public List<DepartmentDto> Children { get; set; } = new(); // 用於回傳樹狀結構
    }

    // 用於新增部門的 DTO
    public class CreateDepartmentDto
    {
        public required string Name { get; set; }
        public Guid? ParentId { get; set; }
    }

    // 用於更新部門的 DTO
    public class UpdateDepartmentDto
    {
        public required string Name { get; set; }
    }
}