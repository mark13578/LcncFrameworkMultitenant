using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// src/Core/Interfaces/IDynamicDataService.cs
namespace Core.Interfaces
{
    public interface IDynamicDataService
    {
        /// <summary>
        /// 根據表單名稱提交一筆資料
        /// </summary>
        /// <param name="formName">表單的唯一名稱 (e.g., "leave_request")</param>
        /// <param name="data">要提交的資料</param>
        /// <returns></returns>
        Task SubmitDataAsync(string formName, Dictionary<string, object> data);

        /// <summary>
        /// 根據表單名稱查詢所有資料
        /// </summary>
        /// <param name="formName">表單的唯一名稱</param>
        /// <returns>資料列表</returns>
        Task<List<Dictionary<string, object>>> GetDataAsync(string formName);
    }
}
