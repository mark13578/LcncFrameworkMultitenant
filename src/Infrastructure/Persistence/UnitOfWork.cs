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
        public IFormDefinitionRepository FormDefinitions { get; private set; } // <-- a. 加入這個屬性

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Users = new UserRepository(_context);
            FormDefinitions = new FormDefinitionRepository(_context); // <-- b. 在這裡初始化
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
