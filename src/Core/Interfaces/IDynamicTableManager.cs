// src/Core/Interfaces/IDynamicTableManager.cs
using Core.Entities;
namespace Core.Interfaces
{
    public interface IDynamicTableManager
    {
        Task CreateTableForFormAsync(FormDefinition formDefinition);
    }
}