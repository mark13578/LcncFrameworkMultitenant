// src/services/menuService.ts
import api from './api';

// 對應後端的 MenuDto
export interface MenuItem {
  id: string;
  name: string;
  icon: string | null;
  path: string;
  sortOrder: number;
  parentId: string | null;
  children: MenuItem[];
}

// 對應後端的 CreateMenuDto / UpdateMenuDto
export interface MenuInput {
  name: string;
  icon?: string | null;
  path: string;
  sortOrder?: number;
  parentId?: string | null;
}

class MenuService {
  // 獲取所有選單項目 (樹狀結構)
  // 給主佈局使用，會根據權限過濾
  async getMenus(): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>('/menus');
    return response.data;
  }

  // 新增給權限管理頁面使用，獲取所有選單
  async getAllMenusForManagement(): Promise<MenuItem[]> {
    const response = await api.get<MenuItem[]>('/menus/all-for-management');
    return response.data;
  }

  // 新增選單項目
  async createMenuItem(data: MenuInput): Promise<MenuItem> {
    const response = await api.post<MenuItem>('/menus', data);
    return response.data;
  }

  // 更新選單項目
  async updateMenuItem(id: string, data: MenuInput): Promise<void> {
    await api.put(`/menus/${id}`, data);
  }

  // 刪除選單項目
  async deleteMenuItem(id: string): Promise<void> {
    await api.delete(`/menus/${id}`);
  }
}

export default new MenuService();