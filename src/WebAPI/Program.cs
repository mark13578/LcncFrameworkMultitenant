// src/WebAPI/Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Infrastructure.Persistence; // �ޥ�
using Infrastructure.Services; // �ޥ�
using Microsoft.EntityFrameworkCore;
using Core.Entities;
using Core.Interfaces;


var builder = WebApplication.CreateBuilder(args);

// **�[�J DbContext �]�w**
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString,
        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

// ���U Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IDynamicTableManager, DynamicTableManager>();
builder.Services.AddScoped<IDynamicDataService, DynamicDataService>();

// **1. �q appsettings.json Ū�� JWT �]�w**
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Key"];

// **2. �[�J�A�Ȩ� DI �e�� (Add services to the container)**
// Allow CORS Services
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173") // ���\�z���e�ݨӷ�
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(); // �ڭ̤���A�B�z Swagger

// **3. �]�w JWT �{�ҪA��**
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // ���ҵo���
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        // ���Ҩ���
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        // ���� Token �����Ĵ���
        ValidateLifetime = true,

        // ����ñ�p���_
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!))
    };
});


var app = builder.Build();

// **4. �]�w HTTP �ШD�޽u (Configure the HTTP request pipeline)**
if (app.Environment.IsDevelopment())
{
    // app.UseSwagger();
    // app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ���� �[�J�o��H�ҥ� CORS �����n�� ����
app.UseCors(MyAllowSpecificOrigins);

// **5. �[�J�{�һP���v�����n��**
// UseAuthentication �����b UseAuthorization ���e
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// **�[�J���ո�� Seeding**
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ApplicationDbContext>();
    // �p�G Users ��ƪ�O�Ū�
    if (!context.Users.Any())
    {
        var defaultOrg = new Organization { Name = "Default Corp" };
        context.Organizations.Add(defaultOrg);

        var adminUser = new User
        {
            Username = "admin",
            // ���n�G�x�s����᪺�K�X
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Email = "admin@lcnc.dev",
            IsActive = true,
            Organization = defaultOrg
        };
        context.Users.Add(adminUser);
        context.SaveChanges();
    }
}


app.Run();