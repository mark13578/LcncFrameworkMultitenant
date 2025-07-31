// src/services/announcementService.ts
import api from './api';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string; // 日期會以 ISO 字串形式傳遞
  expiryDate: string | null;
  isPublished: boolean;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  publishDate: string;
  expiryDate?: string | null;
  isPublished: boolean;
}

class AnnouncementService {
  async getAnnouncements(): Promise<Announcement[]> {
    return (await api.get<Announcement[]>('/announcements')).data;
  }
  async createAnnouncement(data: AnnouncementInput): Promise<Announcement> {
    return (await api.post<Announcement>('/announcements', data)).data;
  }
  async updateAnnouncement(id: string, data: AnnouncementInput): Promise<void> {
    await api.put(`/announcements/${id}`, data);
  }
  async deleteAnnouncement(id: string): Promise<void> {
    await api.delete(`/announcements/${id}`);
  }
}

export default new AnnouncementService();