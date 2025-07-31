// src/services/roleService.ts
import api from './api';

// 對應後端的 RoleDto
export interface Role {
  id: string;
  name: string;
  description: string | null;
}

// 對應後端的 CreateRoleDto / UpdateRoleDto
export interface RoleInput {
  name: string;
  description?: string | null;
}

class RoleService {
  // 獲取所有角色
  async getRoles(): Promise<Role[]> {
    const response = await api.get<Role[]>('/roles');
    return response.data;
  }

  // 新增角色
  async createRole(data: RoleInput): Promise<Role> {
    const response = await api.post<Role>('/roles', data);
    return response.data;
  }

  // 更新角色
  async updateRole(id: string, data: RoleInput): Promise<void> {
    await api.put(`/roles/${id}`, data);
  }

  // 刪除角色
  async deleteRole(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }
}

export default new RoleService();