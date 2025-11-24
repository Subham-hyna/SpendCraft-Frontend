import axiosInstance from '@/services/axiosInstance';

export const authService = {
  // POST login
  login: async (data: any) => {
    const response = await axiosInstance.post('/login', data);
    return response.data;
  },

  // POST logout
  logout: async () => {
    const response = await axiosInstance.post('/logout');
    return response.data;
  },
};
