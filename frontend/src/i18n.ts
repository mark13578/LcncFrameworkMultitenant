// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import api from './services/api'; // 引用我們自訂的 axios 實例

i18n
  .use(HttpBackend) // 使用 http backend 插件
  .use(LanguageDetector) // 使用語言偵測插件
  .use(initReactI18next) // 將 i18n 實例傳遞給 react-i18next
  .init({
    fallbackLng: 'zh-TW', // 如果偵測不到語言，預設使用繁體中文
    debug: true, // 在開發模式下，在 console 中印出 debug 資訊
    interpolation: {
      escapeValue: false, // React 已經會處理 XSS，所以關閉
    },
    backend: {
      // 自訂如何從後端載入翻譯
      request: async (options, url, payload, callback) => {
        try {
          // 使用我們自訂的 axios 實例 (api)，這樣請求就會自動帶上 JWT Token
          const response = await api.get(url);
          callback(null, {
            status: response.status,
            data: response.data,
          });
        } catch (error: any) {
          callback(error, {
            status: error.response?.status,
            data: error.response?.data,
          });
        }
      },
      // 告訴 i18next-http-backend 去哪裡下載語言包
      // {{lng}} 會被自動替換為當前的語言代碼 (例如 zh-TW, en-US)
      loadPath: '/translations/{{lng}}', 
    },
  });

export default i18n;