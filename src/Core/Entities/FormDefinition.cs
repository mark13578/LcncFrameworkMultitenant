using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/FormDefinition.cs
namespace Core.Entities
{
    public class FormDefinition : BaseEntity
    {
        public required string Name { get; set; } // 機器可讀的唯一名稱, e.g., "leave_request"
        public required string DisplayName { get; set; } // 人類可讀的標題, e.g., "員工請假申請單"
        public string? Description { get; set; }

        // 這個表單對應的真實資料儲存表名稱
        public required string UserDataTableName { get; set; }

        public ICollection<FieldDefinition> Fields { get; set; } = new List<FieldDefinition>();
    }
}