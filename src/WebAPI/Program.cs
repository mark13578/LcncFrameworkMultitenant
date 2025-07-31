// src/WebAPI/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Persistence; // 引用
using Infrastructure.Services; // 引用
using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Core.Interfaces;
using System.Linq;


var builder = WebApplication.CreateBuilder(args);

// **加入 DbContext 設定**
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString,
        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

// 註冊 Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IDynamicTableManager, DynamicTableManager>();
builder.Services.AddScoped<IDynamicDataService, DynamicDataService>();

// **1. 從 appsettings.json 讀取 JWT 設定**
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Key"];

// **2. 加入服務到 DI 容器 (Add services to the container)**
// Allow CORS Services
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // 允許您的前端來源
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(); // 我們之後再處理 Swagger

// **3. 設定 JWT 認證服務**
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // 驗證發行者
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        // 驗證受眾
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        // 驗證 Token 的有效期間
        ValidateLifetime = true,

        // 驗證簽署金鑰
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});


var app = builder.Build();

// **4. 設定 HTTP 請求管線 (Configure the HTTP request pipeline)**
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ↓↓ 加入這行以啟用 CORS 中介軟體 ↓↓
app.UseCors(MyAllowSpecificOrigins);

// **5. 加入認證與授權中介軟體**
// UseAuthentication 必須在 UseAuthorization 之前
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// **加入測試資料 Seeding**
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();

    // 確保資料庫已建立
    context.Database.EnsureCreated();

    // 檢查是否已有任何租戶，如果沒有，才建立預設資料
    if (!context.Tenants.Any())
    {
        // 1. 建立一個預設的「租戶 (Tenant)」
        var defaultTenant = new Tenant { Name = "Default Tenant" };
        context.Tenants.Add(defaultTenant);

        // 2. 在該租戶下，建立一個預設的「部門 (Department)」
        var defaultDept = new Department { Name = "General Department", Tenant = defaultTenant };
        context.Departments.Add(defaultDept);

        // 3. 在該租戶下，建立一個預設的「系統管理員」角色
        var adminRole = new Role
        {
            Name = "System Administrator",
            Description = "擁有系統所有權限的管理員",
            TenantId = defaultTenant.Id
        };
        context.Roles.Add(adminRole);

        // 4. 建立一個屬於該租戶和部門的 admin 使用者
        var adminUser = new User
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Email = "admin@lcnc.dev",
            IsActive = true,
            Tenant = defaultTenant,      // 使用新的 Tenant 屬性
            Department = defaultDept   // 使用新的 Department 屬性
        };

        // 5. 建立使用者與角色的關聯
        var userRole = new UserRole { User = adminUser, Role = adminRole };
        context.UserRoles.Add(userRole);

        context.Users.Add(adminUser);
        context.SaveChanges();
    }
}


app.Run();