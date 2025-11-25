import axiosInstance from '@/services/axiosInstance';
import { User } from '@/types/apiResponse';

export const prefix = 'user';

export const userService = {
  // GET fetchUser
  fetchUser: async (): Promise<User> => {
    const response = await axiosInstance.get(`/${prefix}/me`);  
    return response.data;
  },
};
