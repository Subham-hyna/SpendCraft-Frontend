import axiosInstance from '@/services/axiosInstance';
import { GoogleLoginResponse } from '@/types/apiResponse';
import { clearCookies, setCookie } from '@/services/axiosInstance';

export const prefix = 'auth';

export const authService = {
  // POST login
  login: async (data: any): Promise<GoogleLoginResponse> => {
    const response = await axiosInstance.post(`/${prefix}/google-login`, data);
    setCookie('access_token', response.data.access_token);
    setCookie('refresh_token', response.data.refresh_token);
    return response.data;
  },

  // POST logout
  logout: async () => {
    const response = await axiosInstance.post(`/${prefix}/logout`);
    clearCookies();
    return response.data;
  },
};
