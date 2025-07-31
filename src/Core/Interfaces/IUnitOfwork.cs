using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IUnitOfWork.cs
using Core.Entities;

namespace Core.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // 將來有新的實體，就在這裡加入新的 Repository
        IUserRepository Users { get; }
        // 動態表格元件
        IFormDefinitionRepository FormDefinitions { get; }

        // 部門管理元件
        IDepartmentRepository Departments { get; }

        IRoleRepository Roles { get; }
        Task<int> CompleteAsync();


    }
}
