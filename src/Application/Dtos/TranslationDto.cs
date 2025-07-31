namespace Application.Dtos
{
    // 用於管理頁面的 DTO
    public class TranslationDto
    {
        public Guid Id { get; set; }
        public required string LanguageCode { get; set; }
        public required string Key { get; set; }
        public required string Value { get; set; }
    }

    // 用於更新或新增的 DTO
    public class SaveTranslationDto
    {
        public required string LanguageCode { get; set; }
        public required string Key { get; set; }
        public required string Value { get; set; }
    }

    // ↓↓ 新增一個專門用於更新的 DTO ↓↓
    public class UpdateTranslationDto
    {
        public required string Value { get; set; }
    }
}