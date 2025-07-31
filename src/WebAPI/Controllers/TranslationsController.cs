using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class TranslationsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public TranslationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/translations/zh-TW
        [HttpGet("{lang}")]
        public async Task<ActionResult<Dictionary<string, string>>> GetTranslations(string lang)
        {
            var tenantId = GetTenantId();
            var translations = await _unitOfWork.Translations.GetByLanguageAsync(tenantId, lang);

            // 將翻譯列表轉換為前端 i18next 需要的 { "key": "value" } 格式
            var dictionary = translations.ToDictionary(t => t.Key, t => t.Value);

            return Ok(dictionary);
        }

        // POST: api/translations
        [HttpPost]
        public async Task<ActionResult<TranslationDto>> CreateTranslation(SaveTranslationDto createDto)
        {
            var tenantId = GetTenantId();

            // 檢查重複
            var existing = await _unitOfWork.Translations.GetByKeyAsync(tenantId, createDto.LanguageCode, createDto.Key);
            if (existing != null)
            {
                return Conflict($"A translation with the key '{createDto.Key}' for language '{createDto.LanguageCode}' already exists.");
            }

            var translation = new Translation
            {
                TenantId = tenantId,
                LanguageCode = createDto.LanguageCode,
                Key = createDto.Key,
                Value = createDto.Value
            };

            await _unitOfWork.Translations.AddAsync(translation);
            await _unitOfWork.CompleteAsync();

            var resultDto = new TranslationDto { Id = translation.Id, Key = translation.Key, LanguageCode = translation.LanguageCode, Value = translation.Value };
            return CreatedAtAction(nameof(GetTranslations), new { lang = resultDto.LanguageCode }, resultDto);
        }

        // PUT: api/translations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTranslation(Guid id, UpdateTranslationDto updateDto)
        {
            var tenantId = GetTenantId();
            var translation = await _unitOfWork.Translations.GetByIdAsync(id);

            if (translation == null || translation.TenantId != tenantId)
            {
                return NotFound();
            }

            translation.Value = updateDto.Value;

            _unitOfWork.Translations.Update(translation);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/translations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTranslation(Guid id)
        {
            var tenantId = GetTenantId();
            var translation = await _unitOfWork.Translations.GetByIdAsync(id);

            if (translation == null || translation.TenantId != tenantId)
            {
                return NotFound();
            }

            _unitOfWork.Translations.Remove(translation);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}