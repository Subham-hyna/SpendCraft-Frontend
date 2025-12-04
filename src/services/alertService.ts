import axiosInstance from '@/services/axiosInstance';
import { Alert } from '@/types/apiResponse';

export const prefix = 'alert';

export const alertService = {
  getAlert: async (): Promise<Alert> => {
    const response = await axiosInstance.get(`/${prefix}`);
    return response.data;
  },
  update: async (payload: any): Promise<Alert> => {
    const response = await axiosInstance.patch(`/${prefix}`, payload);
    return response.data;
  }
};
