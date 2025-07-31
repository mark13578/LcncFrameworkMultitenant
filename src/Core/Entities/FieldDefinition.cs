using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Entities/FieldDefinition.cs
using Core.Enums;

namespace Core.Entities
{
    public class FieldDefinition : BaseEntity
    {
        public required string Name { get; set; } // 機器可讀的欄位名稱, e.g., "request_date"
        public required string Label { get; set; } // 顯示在介面上的標籤, e.g., "請假日期"
        public FieldType FieldType { get; set; }
        public bool IsRequired { get; set; } = false;
        public int SortOrder { get; set; } = 0;

        // 用 JSON 格式儲存特定欄位的額外設定
        // e.g., for Dropdown: { "options": ["事假", "病假"] }
        // e.g., for TextField: { "maxLength": 100 }
        public string? ConfigurationJson { get; set; }

        public Guid FormDefinitionId { get; set; }
        public FormDefinition? FormDefinition { get; set; }
    }
}