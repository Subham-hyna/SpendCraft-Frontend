import axiosInstance from '@/services/axiosInstance';
import { GoogleLoginResponse } from '@/types/apiResponse';
import { removeCookie, setCookie, setToken, clearTokens } from '@/services/axiosInstance';

export const prefix = 'auth';

export const authService = {
  // POST login
  login: async (data: any): Promise<GoogleLoginResponse> => {
    const response = await axiosInstance.post(`/${prefix}/google-login`, data);
    setCookie('access_token', response.data.access_token);
    setToken('access_token', response.data.access_token);
    setToken('refresh_token', response.data.refresh_token);
    return response.data;
  },

  // POST logout
  logout: async () => {
    const response = await axiosInstance.post(`/${prefix}/logout`);
    removeCookie('access_token');
    clearTokens();
    return response.data;
  },
};
