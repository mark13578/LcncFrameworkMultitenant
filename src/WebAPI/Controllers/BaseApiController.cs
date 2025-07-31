// src/WebAPI/Controllers/BaseApiController.cs
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected Guid GetTenantId()
        {
            // 我們將在 JWT Token 中儲存 TenantId，這裡我們先預留一個固定的 Guid 作為測試
            // 當登入功能與多租戶結合後，這裡將會是動態解析
            // 找到名為 "tenantId" 的 Claim
            var tenantIdClaim = User.FindFirst("tenantId");

            // 為了讓編譯通過，我們先假設一個測試用的 TenantId
            // TODO: 在整合登入功能後，移除這個預設值
            /*if (tenantIdClaim == null)
            {
                // 這裡您需要填入一個您資料庫中 `Tenants` 表已存在的 Guid
                return Guid.Parse("YOUR_EXISTING_TENANT_ID");
            }*/

            if (tenantIdClaim == null || !Guid.TryParse(tenantIdClaim.Value, out var tenantId))
            {
                // 如果 Token 中找不到 TenantId 或格式不正確，拋出一個明確的例外
                // 這會讓後端在開發時直接報錯，而不是靜默地失敗
                throw new InvalidOperationException("無法從 JWT Token 中解析 TenantId。");
            }

            return Guid.Parse(tenantIdClaim.Value);


        }

        // ↓↓ 新增這個輔助方法 ↓↓
        protected Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                throw new InvalidOperationException("無法從 JWT Token 中解析 UserId。");
            }

            return userId;
        }
    }
}