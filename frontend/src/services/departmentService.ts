// src/services/departmentService.ts
import api from './api';

// 對應後端的 DepartmentDto
export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  children: Department[];
}

// 對應後端的 CreateDepartmentDto / UpdateDepartmentDto
export interface DepartmentInput {
  name: string;
  parentId?: string | null;
}

class DepartmentService {
  // 獲取所有部門 (樹狀結構)
  async getDepartments(): Promise<Department[]> {
    const response = await api.get<Department[]>('/departments');
    return response.data;
  }

  // 新增部門
  async createDepartment(data: DepartmentInput): Promise<Department> {
    const response = await api.post<Department>('/departments', data);
    return response.data;
  }

  // 更新部門
  async updateDepartment(id: string, data: DepartmentInput): Promise<void> {
    await api.put(`/departments/${id}`, data);
  }

  // 刪除部門
  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  }
}

export default new DepartmentService();