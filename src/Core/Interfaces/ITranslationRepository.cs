using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Core.Entities;
namespace Core.Interfaces
{
    public interface ITranslationRepository
    {
        
        Task<Translation?> GetByIdAsync(Guid id);
        // 獲取某個租戶、某個語言的所有翻譯
        Task<IEnumerable<Translation>> GetByLanguageAsync(Guid tenantId, string languageCode);
        Task<Translation?> GetByKeyAsync(Guid tenantId, string languageCode, string key);
        Task AddAsync(Translation translation);
        void Update(Translation translation);
        void Remove(Translation translation);
    }
}
