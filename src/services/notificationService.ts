import axiosInstance from '@/services/axiosInstance';
import { Notification } from '@/types/apiResponse';

export const prefix = 'notification';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get(`/${prefix}`);
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await axiosInstance.patch(`/${prefix}/${id}`);
    return response.data;
  },

  markAllAsRead: async (): Promise<string> => {
    const response = await axiosInstance.patch(`/${prefix}/mark-all-as-read`);
    return response.data;
  },
};
