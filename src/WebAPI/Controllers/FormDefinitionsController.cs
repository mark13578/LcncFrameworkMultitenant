// src/WebAPI/Controllers/FormDefinitionsController.cs
using Core.Entities;
using Core.Enums;
using Core.Interfaces;
using Application.Dtos; // <-- 引用 DTOs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    // 為了簡化，DTOs暫時省略，直接使用 Entities
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FormDefinitionsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IDynamicTableManager _tableManager;

        public FormDefinitionsController(IUnitOfWork unitOfWork, IDynamicTableManager tableManager)
        {
            _unitOfWork = unitOfWork;
            _tableManager = tableManager;
        }

       
        [HttpPost]
        public async Task<IActionResult> CreateForm([FromBody] CreateFormRequestDto requestDto)
        {
            //  加入檢查邏輯
            var existingForm = await _unitOfWork.FormDefinitions.GetByNameAsync(requestDto.Name);
            if (existingForm != null)
            {
                // 如果表單已存在，回傳 409 Conflict 錯誤
                return Conflict(new { message = $"名稱為 '{requestDto.Name}' 的表單已經存在。" });
            }

            // 1. 手動從 DTO 映射到 Entity
            var formDefinition = new FormDefinition
            {
                Name = requestDto.Name,
                DisplayName = requestDto.DisplayName,
                Description = requestDto.Description,
                // 2. 在這裡設定對應的實體資料表名稱
                UserDataTableName = $"UserData_{requestDto.Name}",
                Fields = requestDto.Fields.Select(fieldDto => new FieldDefinition
                {
                    Name = fieldDto.Name,
                    Label = fieldDto.Label,
                    FieldType = fieldDto.FieldType,
                    IsRequired = fieldDto.IsRequired,
                    SortOrder = fieldDto.SortOrder,
                    ConfigurationJson = fieldDto.ConfigurationJson
                }).ToList()
            };

            // 3. 將表單定義寫入元數據資料庫
            await _unitOfWork.FormDefinitions.AddAsync(formDefinition);
            await _unitOfWork.CompleteAsync();

            // 4. 呼叫服務，動態建立實體資料表
            try
            {
                await _tableManager.CreateTableForFormAsync(formDefinition);
            }
            catch (Exception ex)
            {
                // 補償機制 (這裡暫時簡化)
                return BadRequest($"建立實體資料表失敗: {ex.Message}");
            }

            // 為了簡化，回傳物件仍用 entity，實務上應該回傳 Response DTO
            // return CreatedAtAction(nameof(GetFormById), new { id = formDefinition.Id }, formDefinition);
            var responseDto = MapToResponseDto(formDefinition);
            return CreatedAtAction(nameof(GetFormById), new { id = responseDto.Id }, responseDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetFormById(Guid id)
        {
            // 在您的 Repository 中實作 GetByIdWithFieldsAsync 方法
             var form = await _unitOfWork.FormDefinitions.GetByIdWithFieldsAsync(id);
            if (form == null) return NotFound();

            var responseDto = MapToResponseDto(form);
            return Ok(responseDto);
        }

        [HttpGet("by-name/{name}")]
        public async Task<IActionResult> GetFormByName(string name)
        {
            var form = await _unitOfWork.FormDefinitions.GetByNameAsync(name);
            if (form == null)
            {
                return NotFound(new { message = $"找不到名稱為 '{name}' 的表單定義。" });
            }

            var responseDto = MapToResponseDto(form);
            return Ok(responseDto);
        }

        // 新增一個私有的輔助方法來做映射
        private FormDefinitionResponseDto MapToResponseDto(FormDefinition form)
        {
            return new FormDefinitionResponseDto
            {
                Id = form.Id,
                Name = form.Name,
                DisplayName = form.DisplayName,
                Description = form.Description,
                UserDataTableName = form.UserDataTableName,
                Fields = form.Fields.Select(f => new FieldDefinitionResponseDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Label = f.Label,
                    FieldType = f.FieldType,
                    IsRequired = f.IsRequired,
                    SortOrder = f.SortOrder,
                    ConfigurationJson = f.ConfigurationJson
                }).ToList()
            };
        }

        // GET: api/formdefinitions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FormDefinitionResponseDto>>> GetFormDefinitions()
        {
            var tenantId = GetTenantId();
            var forms = await _unitOfWork.FormDefinitions.GetAllByTenantAsync(tenantId);
            var dtos = forms.Select(MapToResponseDto); // 重用我們的映射方法
            return Ok(dtos);
        }
    }
}