// src/services/authService.ts
import api from './api';

// 定義登入請求的資料結構
interface LoginCredentials {
  username?: string;
  password?: string;
}

// 定義登入成功後的回應結構
interface LoginResponse {
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

    // 登入成功後，將 token 存儲在瀏覽器的 localStorage 中
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  }

  logout() {
    // 登出時，從 localStorage 移除 token
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }
}

// 導出一個實例化的 AuthService，方便在其他地方直接使用
export default new AuthService();