using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class SystemParametersController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public SystemParametersController(IUnitOfWork unitOfWork) { _unitOfWork = unitOfWork; }

        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<SystemParameterDto>>> GetByCategory(string category)
        {
            var tenantId = GetTenantId();
            var parameters = await _unitOfWork.SystemParameters.GetByCategoryAsync(tenantId, category);
            return Ok(parameters.Select(p => new SystemParameterDto { Id = p.Id, Category = p.Category, Key = p.Key, Value = p.Value, DisplayName = p.DisplayName, IsSystemLocked = p.IsSystemLocked, Description = p.Description }));
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateSystemParameterDto createDto)
        {
            var tenantId = GetTenantId();
            var newParam = new SystemParameter
            {
                TenantId = tenantId,
                Category = createDto.Category,
                Key = createDto.Key,
                Value = createDto.Value,
                DisplayName = createDto.DisplayName,
                IsSystemLocked = createDto.IsSystemLocked,
                Description = createDto.Description
            };
            await _unitOfWork.SystemParameters.AddAsync(newParam);
            await _unitOfWork.CompleteAsync();
            return Ok(new SystemParameterDto { Id = newParam.Id, Category = newParam.Category, Key = newParam.Key, Value = newParam.Value, DisplayName = newParam.DisplayName, IsSystemLocked = newParam.IsSystemLocked, Description = newParam.Description });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateSystemParameterDto updateDto)
        {
            var tenantId = GetTenantId();
            var param = await _unitOfWork.SystemParameters.GetByIdAsync(id);
            if (param == null || param.TenantId != tenantId) return NotFound();

            if (param.IsSystemLocked)
            {
                return BadRequest("系統內置參數無法被修改。");
            }

            param.Value = updateDto.Value;
            param.DisplayName = updateDto.DisplayName;
            param.Description = updateDto.Description;

            _unitOfWork.SystemParameters.Update(param);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var tenantId = GetTenantId();
            var param = await _unitOfWork.SystemParameters.GetByIdAsync(id);
            if (param == null || param.TenantId != tenantId) return NotFound();

            if (param.IsSystemLocked)
            {
                return BadRequest("系統內置參數無法被刪除。");
            }

            _unitOfWork.SystemParameters.Remove(param);
            await _unitOfWork.CompleteAsync();
            return NoContent();
        }
    }
}