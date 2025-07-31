using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Infrastructure/Persistence/ApplicationDbContext.cs
using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // 為 Core 專案中定義的每個實體建立 DbSet
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<FormDefinition> FormDefinitions { get; set; }
        public DbSet<FieldDefinition> FieldDefinitions { get; set; }
        public DbSet<Department> Departments { get; set; } // 新增 Departments
        public DbSet<MenuItem> MenuItems { get; set; } // 驅動網頁選單SQL表


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 設定 UserRole 的複合主鍵
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            // 設定 User 和 UserRole 之間的一對多關係
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            // 設定 Role 和 UserRole 之間的一對多關係
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);


            // Department 的階層關聯設定 (應保留)
            // 這段邏輯才是正確使用您貼出程式碼的地方
            modelBuilder.Entity<Department>()
                .HasOne(d => d.Parent)
                .WithMany(d => d.Children)
                .HasForeignKey(d => d.ParentId)
                .OnDelete(DeleteBehavior.Restrict);

            // 設定 User 與 Tenant 的關聯
            modelBuilder.Entity<User>()
                .HasOne(u => u.Tenant)
                .WithMany(t => t.Users)
                .HasForeignKey(u => u.TenantId)
                .OnDelete(DeleteBehavior.Restrict); // 當 Tenant 被刪除時，如果底下還有 User，則阻止刪除

            // 設定 User 與 Department 的關聯
            modelBuilder.Entity<User>()
                .HasOne(u => u.Department)
                .WithMany(d => d.Users)
                .HasForeignKey(u => u.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict); // 當 Department 被刪除時，如果底下還有 User，則阻止刪除 (這裡也可以設定為 NoAction)

            modelBuilder.Entity<MenuItem>()
               .HasOne(m => m.Parent)
               .WithMany(m => m.Children)
               .HasForeignKey(m => m.ParentId)
               .OnDelete(DeleteBehavior.Restrict); // 不允許刪除仍有子選單的項目
        }
    }
}