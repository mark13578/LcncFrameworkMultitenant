// src/WebAPI/Controllers/FormDataController.cs
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/form-data")]
    [Authorize]
    public class FormDataController : ControllerBase
    {
        private readonly IDynamicDataService _dataService;

        public FormDataController(IDynamicDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpPost("{formName}")]
        public async Task<IActionResult> Submit(string formName, [FromBody] Dictionary<string, object> data)
        {
            try
            {
                await _dataService.SubmitDataAsync(formName, data);
                return Ok(new { message = "資料已成功提交" });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{formName}")]
        public async Task<IActionResult> Get(string formName)
        {
            try
            {
                var data = await _dataService.GetDataAsync(formName);
                return Ok(data);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}