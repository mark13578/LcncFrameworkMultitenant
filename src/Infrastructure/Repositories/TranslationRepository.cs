using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Core.Entities;
using Core.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
namespace Infrastructure.Repositories
{
    public class TranslationRepository : ITranslationRepository
    {
        private readonly ApplicationDbContext _context;
        public TranslationRepository(ApplicationDbContext context) { _context = context; }

        public async Task<Translation?> GetByIdAsync(Guid id)
        {
            return await _context.Translations.FindAsync(id);
        }

        public async Task<IEnumerable<Translation>> GetByLanguageAsync(Guid tenantId, string languageCode) =>
            await _context.Translations
                .Where(t => t.TenantId == tenantId && t.LanguageCode == languageCode)
                .ToListAsync();

        public async Task<Translation?> GetByKeyAsync(Guid tenantId, string languageCode, string key)
        {
            return await _context.Translations
                .FirstOrDefaultAsync(t => t.TenantId == tenantId && t.LanguageCode == languageCode && t.Key == key);
        }

        public async Task AddAsync(Translation translation)
        {
            await _context.Translations.AddAsync(translation);
        }

        public void Update(Translation translation)
        {
            _context.Translations.Update(translation);
        }

        public void Remove(Translation translation)
        {
            _context.Translations.Remove(translation);
        }
    }
}