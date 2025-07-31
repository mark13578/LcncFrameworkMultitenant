// src/WebAPI/Controllers/AnnouncementsController.cs
using Application.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [Authorize]
    public class AnnouncementsController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public AnnouncementsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/announcements
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetAnnouncements()
        {
            var tenantId = GetTenantId();
            var announcements = await _unitOfWork.Announcements.GetAllByTenantAsync(tenantId);

            var dtos = announcements.Select(a => new AnnouncementDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                PublishDate = a.PublishDate,
                ExpiryDate = a.ExpiryDate,
                IsPublished = a.IsPublished
            });

            return Ok(dtos);
        }

        // GET: api/announcements/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<AnnouncementDto>> GetAnnouncementById(Guid id)
        {
            var tenantId = GetTenantId();
            var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);

            if (announcement == null || announcement.TenantId != tenantId)
            {
                return NotFound();
            }

            var dto = new AnnouncementDto
            {
                Id = announcement.Id,
                Title = announcement.Title,
                Content = announcement.Content,
                PublishDate = announcement.PublishDate,
                ExpiryDate = announcement.ExpiryDate,
                IsPublished = announcement.IsPublished
            };
            return Ok(dto);
        }

        // POST: api/announcements
        [HttpPost]
        public async Task<ActionResult<AnnouncementDto>> CreateAnnouncement(CreateAnnouncementDto createDto)
        {
            var tenantId = GetTenantId();
            var announcement = new Announcement
            {
                Title = createDto.Title,
                Content = createDto.Content,
                PublishDate = createDto.PublishDate,
                ExpiryDate = createDto.ExpiryDate,
                IsPublished = createDto.IsPublished,
                TenantId = tenantId
            };

            await _unitOfWork.Announcements.AddAsync(announcement);
            await _unitOfWork.CompleteAsync();

            var resultDto = new AnnouncementDto { Id = announcement.Id, Title = announcement.Title, Content = announcement.Content, PublishDate = announcement.PublishDate, ExpiryDate = announcement.ExpiryDate, IsPublished = announcement.IsPublished };
            return CreatedAtAction(nameof(GetAnnouncementById), new { id = announcement.Id }, resultDto);
        }

        // PUT: api/announcements/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAnnouncement(Guid id, UpdateAnnouncementDto updateDto)
        {
            var tenantId = GetTenantId();
            var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);

            if (announcement == null || announcement.TenantId != tenantId)
            {
                return NotFound();
            }

            announcement.Title = updateDto.Title;
            announcement.Content = updateDto.Content;
            announcement.PublishDate = updateDto.PublishDate;
            announcement.ExpiryDate = updateDto.ExpiryDate;
            announcement.IsPublished = updateDto.IsPublished;

            _unitOfWork.Announcements.Update(announcement);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // DELETE: api/announcements/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAnnouncement(Guid id)
        {
            var tenantId = GetTenantId();
            var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);

            if (announcement == null || announcement.TenantId != tenantId)
            {
                return NotFound();
            }

            _unitOfWork.Announcements.Remove(announcement);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}