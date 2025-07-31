// src/Infrastructure/Services/DynamicDataService.cs
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json; 

namespace Infrastructure.Services
{
    public class DynamicDataService : IDynamicDataService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;

        public DynamicDataService(IUnitOfWork unitOfWork, ApplicationDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }

        public async Task SubmitDataAsync(string formName, Dictionary<string, object> data)
        {
            // 1. 取得表單定義
            var formDef = await _unitOfWork.FormDefinitions.GetByNameAsync(formName); // 您需要在 Repository 實作此方法
            if (formDef == null) throw new KeyNotFoundException($"找不到名稱為 '{formName}' 的表單。");

            // 2. 驗證傳入的資料 (簡化版：檢查必填欄位)
            foreach (var field in formDef.Fields.Where(f => f.IsRequired))
            {
                if (!data.ContainsKey(field.Name) || data[field.Name] == null)
                {
                    throw new ArgumentException($"必填欄位 '{field.Label}' 未提供資料。");
                }
            }

            // 3. 安全地建構參數化 SQL INSERT 語句
            var tableName = formDef.UserDataTableName;
            var columns = new List<string> { "Id", "SubmittedAt" };
            var parameters = new List<SqlParameter>
            {
                new SqlParameter("@p0", Guid.NewGuid()),
                new SqlParameter("@p1", DateTimeOffset.UtcNow)
            };
            var valuePlaceholders = new List<string> { "@p0", "@p1" };

            int paramIndex = 2;
            foreach (var field in formDef.Fields)
            {
                if (data.TryGetValue(field.Name, out var value))
                {
                    // 新增邏輯，以處理 JsonElement
                    object finalValue = value;
                    if (value is JsonElement element)
                    {
                        finalValue = element.ValueKind switch
                        {
                            JsonValueKind.String => element.GetString()!,
                            JsonValueKind.Number => element.GetDecimal(),
                            JsonValueKind.True => true,
                            JsonValueKind.False => false,
                            JsonValueKind.Null => DBNull.Value,
                            _ => element.ToString() // 作為最後的備用方案
                        };
                    }

                    columns.Add(field.Name);
                    valuePlaceholders.Add($"@p{paramIndex}");
                    // 使用轉換後的值
                    parameters.Add(new SqlParameter($"@p{paramIndex}", finalValue ?? DBNull.Value));
                    paramIndex++;
                }
            }

            var sql = $"INSERT INTO {tableName} ({string.Join(", ", columns)}) VALUES ({string.Join(", ", valuePlaceholders)});";

            // 4. 執行 SQL
            await _context.Database.ExecuteSqlRawAsync(sql, parameters);
        }

        public async Task<List<Dictionary<string, object>>> GetDataAsync(string formName)
        {
            // 1. 取得表單定義
            var formDef = await _unitOfWork.FormDefinitions.GetByNameAsync(formName);
            if (formDef == null) throw new KeyNotFoundException($"找不到名稱為 '{formName}' 的表單。");

            var tableName = formDef.UserDataTableName;
            var result = new List<Dictionary<string, object>>();

            // 2. 使用 DbDataReader 讀取動態查詢結果
            using (var command = _context.Database.GetDbConnection().CreateCommand())
            {
                command.CommandText = $"SELECT * FROM {tableName}";
                await _context.Database.OpenConnectionAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new Dictionary<string, object>();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = reader.GetValue(i);
                        }
                        result.Add(row);
                    }
                }
            }
            return result;
        }
    }
}