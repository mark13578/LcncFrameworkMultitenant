// src/services/systemParameterService.ts
import api from './api';

export interface SystemParameter {
  id: string;
  category: string;
  key: string;
  value: string | null;
  displayName: string | null; 
  isSystemLocked: boolean; 
  description: string | null;
}

export interface CreateSystemParameterInput {
  category: string;
  key: string;
  value?: string | null;
  displayName?: string | null; 
  isSystemLocked?: boolean; 
  description?: string | null;
}

export interface UpdateSystemParameterInput {
  value?: string | null;
  displayName?: string | null; 
  description?: string | null;
}

class SystemParameterService {
  // 根據分類獲取參數
  async getParametersByCategory(category: string): Promise<SystemParameter[]> {
    const response = await api.get<SystemParameter[]>(`/systemparameters/category/${category}`);
    return response.data;
  }

  // 新增參數
  async createParameter(data: CreateSystemParameterInput): Promise<SystemParameter> {
    const response = await api.post<SystemParameter>('/systemparameters', data);
    return response.data;
  }

  // 更新參數
  async updateParameter(id: string, data: UpdateSystemParameterInput): Promise<void> {
    await api.put(`/systemparameters/${id}`, data);
  }

  // 刪除參數
  async deleteParameter(id: string): Promise<void> {
    await api.delete(`/systemparameters/${id}`);
  }
}

export default new SystemParameterService();