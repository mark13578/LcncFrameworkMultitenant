// src/services/userService.ts
import api from './api';

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
}

class UserService {
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
  }
}

export default new UserService();