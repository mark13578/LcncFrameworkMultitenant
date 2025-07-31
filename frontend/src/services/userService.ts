// src/services/userService.ts
import api from './api';

// --- TypeScript 型別定義 ---

// 對應後端的 UserDto
export interface User {
  id: string;
  username: string;
  email: string | null;
  isActive: boolean;
  departmentName: string | null;
  roles: string[];
}

// 對應後端的 UserDetailDto
export interface UserDetail {
  id: string;
  username: string;
  email: string | null;
  isActive: boolean;
  departmentId: string;
  roleIds: string[];
}

// 對應後端的 CreateUserDto
export interface CreateUserInput {
  username: string;
  password?: string; // 密碼在新增時是必須的
  email?: string | null;
  isActive: boolean;
  departmentId: string;
  roleIds: string[];
}

// 對應後端的 UpdateUserDto
export interface UpdateUserInput {
  email?: string | null;
  isActive: boolean;
  departmentId: string;
  roleIds: string[];
}

// --- ---

class UserService {
  async getMyProfile(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  }

  // 獲取所有使用者
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  }

  // 獲取單一使用者詳情
  async getUserById(id: string): Promise<UserDetail> {
    const response = await api.get<UserDetail>(`/users/${id}`);
    return response.data;
  }

  // 新增使用者
  async createUser(data: CreateUserInput): Promise<User> {
    const response = await api.post<User>('/users', data);
    return response.data;
  }

  // 更新使用者
  async updateUser(id: string, data: UpdateUserInput): Promise<void> {
    await api.put(`/users/${id}`, data);
  }

  // 刪除使用者 (我們後端暫未實作，但先保留介面)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }
}

export default new UserService();