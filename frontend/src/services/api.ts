// src/services/api.ts
import axios from 'axios';
import authService from './authService'; // 引用 authService 以便取得 token

// 請將 5036 替換成您後端 API 實際的 port 號
const API_BASE_URL = 'http://localhost:5036/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ↓↓ 加入攔截器邏輯 ↓↓
api.interceptors.request.use(
    (config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default api;