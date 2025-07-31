// src/Infrastructure/Services/DynamicTableManager.cs
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Infrastructure.Services
{
    public class DynamicTableManager : IDynamicTableManager
    {
        private readonly ApplicationDbContext _context;

        public DynamicTableManager(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateTableForFormAsync(FormDefinition formDefinition)
        {
            var tableName = formDefinition.UserDataTableName;

            // !!極度重要!!: 驗證表名稱，防止 SQL 注入
            if (!IsValidTableName(tableName))
            {
                throw new ArgumentException("無效的資料表名稱。");
            }

            // ↓↓ 加入判斷表格是否存在的邏輯 (以 T-SQL 為例) ↓↓
            var checkTableExistsSql = $"IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='{tableName}' AND xtype='U')";

            var sb = new StringBuilder($"{checkTableExistsSql} BEGIN CREATE TABLE {tableName} (");
            sb.Append("Id UNIQUEIDENTIFIER PRIMARY KEY, ");
            sb.Append("SubmittedAt DATETIMEOFFSET NOT NULL, ");

            foreach (var field in formDefinition.Fields.OrderBy(f => f.SortOrder))
            {
                // !!極度重要!!: 驗證欄位名稱
                if (!IsValidColumnName(field.Name)) continue;

                var columnName = field.Name;
                var sqlFieldType = GetSqlType(field.FieldType);
                var nullable = field.IsRequired ? "NOT NULL" : "NULL";
                sb.Append($"{columnName} {sqlFieldType} {nullable}, ");
            }

            sb.Length -= 2; // 移除最後的 ", "
            sb.Append("); END;"); // <-- 加上 END

            await _context.Database.ExecuteSqlRawAsync(sb.ToString());
        }

        private string GetSqlType(FieldType fieldType)
        {
            return fieldType switch
            {
                FieldType.TextField => "NVARCHAR(MAX)",
                FieldType.NumberField => "DECIMAL(18, 2)",
                FieldType.DatePicker => "DATETIMEOFFSET",
                FieldType.Checkbox => "BIT",
                FieldType.Dropdown => "NVARCHAR(255)",
                _ => "NVARCHAR(MAX)"
            };
        }

        // 基本的驗證函式，只允許字母、數字、底線
        private bool IsValidTableName(string name) => !string.IsNullOrWhiteSpace(name) && name.All(c => char.IsLetterOrDigit(c) || c == '_');
        private bool IsValidColumnName(string name) => IsValidTableName(name);
    }
}