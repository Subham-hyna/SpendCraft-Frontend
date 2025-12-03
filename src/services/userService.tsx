import axiosInstance from '@/services/axiosInstance';
import { ProfileStatsResponse, User } from '@/types/apiResponse';

export const prefix = 'user';

export const userService = {
  // POST uploadImage
  uploadImage: async (payload: FormData): Promise<User> => {
    const response = await axiosInstance.post(`/${prefix}/image`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  // GET fetchUser
  fetchUser: async (): Promise<User> => {
    const response = await axiosInstance.get(`/${prefix}/me`);  
    return response.data;
  },

  profileStats: async (payload: any): Promise<ProfileStatsResponse> => {
    const response = await axiosInstance.get(`/${prefix}/profile-stats`, {
      params: payload,
    });
    return response.data;
  },
  // PATCH updateUser
  updateUser: async (payload: any): Promise<User> => {
    const response = await axiosInstance.patch(`/${prefix}`, payload);
    return response.data;
  },
};
