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
        IFormDefinitionRepository FormDefinitions { get; }  // 共用表單元件

        // 部門管理元件
        IDepartmentRepository Departments { get; }  // 部門管理

        IRoleRepository Roles { get; }  // 角色管理

        IMenuItemRepository MenuItems { get; } // 框架畫面的選單
        Task<int> CompleteAsync();


    }
}
