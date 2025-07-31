// src/WebAPI/Controllers/DepartmentsController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class DepartmentsController : BaseApiController    // 繼承 BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public DepartmentsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
        {
            var tenantId = GetTenantId();
            var departments = await _unitOfWork.Departments.GetAllByTenantAsync(tenantId);

            // 將扁平列表轉換為樹狀結構 (此為簡化版，您未來可優化)
            var departmentDtos = departments.Select(d => new DepartmentDto { Id = d.Id, Name = d.Name, ParentId = d.ParentId }).ToList();
            var tree = departmentDtos.Where(d => d.ParentId == null).ToList();
            tree.ForEach(d => AddChildren(d, departmentDtos));

            return Ok(tree);
        }

        private void AddChildren(DepartmentDto parent, List<DepartmentDto> all)
        {
            parent.Children = all.Where(d => d.ParentId == parent.Id).ToList();
            parent.Children.ForEach(d => AddChildren(d, all));
        }

        // GET: api/departments/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetDepartmentById(Guid id)
        {
            var tenantId = GetTenantId();
            var department = await _unitOfWork.Departments.GetByIdAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            // 安全性檢查：確保使用者只能存取自己租戶下的部門
            if (department.TenantId != tenantId)
            {
                return NotFound(); // 對於非所屬租戶的資源，回傳 NotFound 更安全
            }

            var dto = new DepartmentDto { Id = department.Id, Name = department.Name, ParentId = department.ParentId };
            return Ok(dto);
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDto>> CreateDepartment(CreateDepartmentDto createDto)
        {
            var tenantId = GetTenantId();
            var department = new Department
            {
                Name = createDto.Name,
                ParentId = createDto.ParentId,
                TenantId = tenantId // 確保新增的部門屬於當前租戶
            };

            await _unitOfWork.Departments.AddAsync(department);
            await _unitOfWork.CompleteAsync();

            var dto = new DepartmentDto { Id = department.Id, Name = department.Name, ParentId = department.ParentId };
            return CreatedAtAction(nameof(GetDepartments), new { id = department.Id }, dto);
        }

        // PUT: api/departments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(Guid id, UpdateDepartmentDto updateDto)
        {
            var tenantId = GetTenantId();
            var department = await _unitOfWork.Departments.GetByIdAsync(id);

            if (department == null || department.TenantId != tenantId)
            {
                return NotFound();
            }

            department.Name = updateDto.Name;
            // 未來可以擴充更新 ParentId 等邏輯

            _unitOfWork.Departments.Update(department);
            await _unitOfWork.CompleteAsync();

            return NoContent(); // HTTP 204: 成功執行，無回傳內容
        }

        // DELETE: api/departments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(Guid id)
        {
            var tenantId = GetTenantId();
            var department = await _unitOfWork.Departments.GetByIdWithDetailsAsync(id); // 使用新方法獲取關聯資料

            if (department == null || department.TenantId != tenantId)
            {
                return NotFound();
            }

            // 業務邏輯檢查：不允許刪除含有子部門或使用者的部門
            if (department.Children.Any() || department.Users.Any())
            {
                return BadRequest("無法刪除：該部門底下仍有子部門或使用者。");
            }

            _unitOfWork.Departments.Remove(department);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
        // 您可以依照上面的模式，繼續完成 GetById, Update, Delete 等 API 端點
    }
}