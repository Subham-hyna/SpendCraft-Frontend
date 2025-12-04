import axiosInstance from '@/services/axiosInstance';
import { Setting } from '@/types/apiResponse';

export const prefix = 'setting';

export const settingService = {
  getSetting: async (): Promise<Setting> => {
    const response = await axiosInstance.get(`/${prefix}`);
    return response.data;
  },

  updateSetting: async (payload: any): Promise<Setting> => {
    const response = await axiosInstance.patch(`/${prefix}`, payload);
    return response.data;
  },
};
