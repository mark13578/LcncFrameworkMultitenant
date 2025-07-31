using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Infrastructure/Persistence/UnitOfWork.cs
using Core.Interfaces;
using Infrastructure.Repositories; // 我們等下會建立這個

namespace Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public IUserRepository Users { get; private set; }
        public IFormDefinitionRepository FormDefinitions { get; private set; } // 表單屬性
        public IDepartmentRepository Departments { get; private set; } // 部門管理屬性
        public IRoleRepository Roles { get; private set; }

        public IMenuItemRepository MenuItems { get; private set; } // 網頁核心選單

        public ISystemParameterRepository SystemParameters { get; private set; }    // 系統參數

        public IAnnouncementRepository Announcements { get; private set; }  // 公告管理

        public ITranslationRepository Translations { get; private set; }    // 多國語言
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            FormDefinitions = new FormDefinitionRepository(_context); // 初始化動態表單物件
            Departments = new DepartmentRepository(_context); // 初始化部門物件
            Roles = new RoleRepository(_context);   // 初始化角色
            MenuItems = new MenuItemRepository(_context);   // 初始化程式選單
            SystemParameters = new SystemParameterRepository(_context); // 初始化系統參數與字典
            Announcements = new AnnouncementRepository(_context);   // 初始化公告
            Translations = new TranslationRepository(_context); // 初始化 系統多國語言
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
