using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Application/Dtos/MenuDto.cs
namespace Application.Dtos
{
    /// <summary>
    /// 用於 API 回傳選單結構的資料傳輸物件
    /// </summary>
    public class MenuDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Icon { get; set; }
        // Path 是可選的，允許建立空的父層選單
        public string? Path { get; set; }
        public int SortOrder { get; set; }
        public Guid? ParentId { get; set; }
        public List<MenuDto> Children { get; set; } = new();
    }

    /// <summary>
    /// 用於從 API 接收「新增」選單請求的資料傳輸物件
    /// </summary>
    public class CreateMenuDto
    {
        public required string Name { get; set; }
        public string? Icon { get; set; }
        public string? Path { get; set; }
        public int SortOrder { get; set; } = 0;
        public Guid? ParentId { get; set; }
    }

    public class UpdateMenuDto : CreateMenuDto { }
}